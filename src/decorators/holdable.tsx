// tslint:disable:no-any align semicolon curly typedef jsdoc-format max-line-length
import * as React from 'react';

import displayName from '../utils/displayName';

type MouseOrTouchEvent<T> = React.MouseEvent<T> | React.TouchEvent<T>;

/** Exponential decay */
function decay(initial: number, x: number, rate = 1) {
  if (initial === 0) return 0;
  return (Math.exp(1 - x * rate) / Math.E) * initial;
}

/**
 * Takes multiple functions or undefined values and returns a new function that
 * calls each of the defined values individually with the arguments of the inner
 * function.
 */
function callAll(...fns: Array<undefined | Function>) {
  return (...args: Array<any>) => {
    fns.forEach(fn => {
      if (fn != null) fn(...args);
    });
  };
}

interface Props {
  /** Called whenever the component is triggered while holding.
   *  Must return either `true` to continue the gesture or `false` to abort */
  onHold: (
    event: undefined | MouseOrTouchEvent<any>,
    iteration: number,
  ) => boolean;

  /** Called when the component hold is stopped. */
  onHoldComplete?: (
    event: undefined | MouseOrTouchEvent<any>,
    moved: boolean,
  ) => void;

  /** Called when the component hold is stopped before reaching the configured
   *  initial delay. */
  onPress?: (event: undefined | MouseOrTouchEvent<any>) => void;

  // Events the component also handles itself and needs to forward
  // explicitely to be fully transparent to the component user.
  //
  onMouseDown?: (event: React.MouseEvent<any>) => void;
  onMouseUp?: (event: React.MouseEvent<any>) => void;
  onMouseLeave?: (event: React.MouseEvent<any>) => void;
  onTouchStart?: (event: React.TouchEvent<any>) => void;
  onTouchMove?: (event: React.TouchEvent<any>) => void;
  onTouchEnd?: (event: React.TouchEvent<any>) => void;
  onTouchCancel?: (event: React.TouchEvent<any>) => void;

  [prop: string]: any;
}

interface RequiredProps {
  onMouseDown?: (event: React.MouseEvent<any>) => void;
  onMouseUp?: (event: React.MouseEvent<any>) => void;
  onMouseLeave?: (event: React.MouseEvent<any>) => void;
  onTouchStart?: (event: React.TouchEvent<any>) => void;
  onTouchMove?: (event: React.TouchEvent<any>) => void;
  onTouchEnd?: (event: React.TouchEvent<any>) => void;
  onTouchCancel?: (event: React.TouchEvent<any>) => void;
}

interface Point {
  x: number;
  y: number;
}

function points(event: MouseEvent | TouchEvent): Array<Point> {
  if (event instanceof MouseEvent) {
    return [{ x: event.clientX, y: event.clientY }];
  }

  let ps = [];
  for (let n = 0; n < event.touches.length; n++) {
    const touch = event.touches.item(n);
    if (touch != null) ps.push({ x: touch.clientX, y: touch.clientY });
  }
  return ps;
}

function deltas(a: Array<Point>, b: Array<Point>): Array<Point> {
  const left = a.length <= b.length ? a : b;
  const right = a.length <= b.length ? b : a;

  return left.map((point, index) => ({
    x: Math.abs(right[index].x - point.x),
    y: Math.abs(right[index].y - point.y),
  }));
}

/**
 * holdable is a higher-order component that exposes `onHold` and
 * `onHoldComplete` callbacks on the wrapped component.
 * `onHold` will be called at least once on `onMouseDown` and then with
 * increasing frequency following an exponential decay function.
 * The optional callback `onHoldComplete` will called exactly once for each
 * event cycle if specified.
 */
export default function holdable(options: { delay: number }) {
  return function<P extends RequiredProps>(
    Component: React.ComponentClass<P> | React.StatelessComponent<P>,
  ): React.ComponentClass<Props & P> {
    return class Holdable extends React.Component<Props & P> {
      static displayName = `Holdable(${displayName(Component)})`;

      timer: undefined | number;
      holdExceededDelay: boolean = false;
      shouldStop: boolean = false;
      startPoints: undefined | Array<Point>;

      componentWillUnmount() {
        if (this.timer != null) {
          clearTimeout(this.timer);
          this.timer = undefined;
        }
      }

      scheduleNext = (
        iteration: number,
        callback: (iteration: number) => boolean,
      ) => {
        const baseInterval = 700;
        const decayRate = 0.5;
        const minimum = 30;

        const nextInterval = Math.max(
          minimum,
          decay(baseInterval, iteration, decayRate),
        );

        this.timer = window.setTimeout(() => {
          if (this.timer == null) return;

          const next = callback(iteration);
          if (next === true) {
            this.scheduleNext(iteration + 1, callback);
          }
        }, nextInterval);
      };

      handleStart = (event: MouseOrTouchEvent<any>) => {
        // event.stopPropagation();
        event.preventDefault();

        // Start already handled, ignore additional event.
        if (this.timer != null) return;

        this.holdExceededDelay = false;
        this.shouldStop = false;

        this.startPoints = points(event.nativeEvent);

        event.persist();
        this.timer = window.setTimeout(() => {
          this.holdExceededDelay = true;
          if (!this.handleIteration(0, event)) {
            this.handleStop(event);
          } else if (this.timer != null) {
            this.scheduleNext(1, iteration =>
              this.handleIteration(iteration, event),
            );
          }
        }, options.delay);
      };

      handleIteration = (iteration: number, event: MouseOrTouchEvent<any>) => {
        if (this.timer == null) return false;

        const continueHold: any =
          this.shouldStop || this.props.onHold(event, iteration);

        if (!(continueHold === true || continueHold === false)) {
          throw new Error(
            '`onHold` must return a boolean to either continue (true) or abort (false) the gesture.',
          );
        }

        if (continueHold !== true) {
          this.handleStop(event);
          return false;
        }

        return true;
      };

      handleMove = (event: MouseOrTouchEvent<any>) => {
        const nextPoints = event != null ? points(event.nativeEvent) : [];
        const pointDeltas =
          this.startPoints != null ? deltas(this.startPoints, nextPoints) : [];

        const maxDelta = pointDeltas.reduce(
          (max, p) => Math.max(max, p.x, p.y),
          0,
        );

        if (maxDelta > 10) {
          this.shouldStop = true;
        }
      };

      handleStop = (event: undefined | MouseOrTouchEvent<any>) => {
        // Always prevent default even if timer not running, because otherwise
        // after touch tap the events mousedown, mouseup and mouseleave are
        // raised in this causes onPress to be called.
        if (event != null) event.preventDefault();

        if (this.timer != null) {
          clearTimeout(this.timer);

          const nextPoints = event != null ? points(event.nativeEvent) : [];
          const pointDeltas =
            this.startPoints != null
              ? deltas(this.startPoints, nextPoints)
              : [];
          const maxDelta = pointDeltas.reduce(
            (max, p) => Math.max(max, p.x, p.y),
            0,
          );
          if (maxDelta > 10) {
            this.shouldStop = true;
          }

          if (this.holdExceededDelay) {
            if (this.props.onHoldComplete) {
              this.props.onHoldComplete(event, this.shouldStop);
            }
          } else {
            if (this.props.onPress) {
              // Only trigger press in case pointers have not moved
              // significantly
              if (!this.shouldStop && this.props.onPress) {
                this.props.onPress(event);
              }
            }
          }
        }

        this.timer = undefined;
        this.startPoints = undefined;
      };

      render() {
        const { onHold, onHoldComplete, onPress, ...extraProps } = this
          .props as Props;

        return (
          <Component
            {...extraProps}
            onMouseDown={callAll(this.props.onMouseDown, this.handleStart)}
            onMouseUp={callAll(this.props.onMouseUp, this.handleStop)}
            onMouseLeave={callAll(this.props.onMouseLeave, this.handleStop)}
            onTouchStart={callAll(this.props.onTouchStart, this.handleStart)}
            onTouchEnd={callAll(this.props.onTouchEnd, this.handleStop)}
            onTouchMove={callAll(this.props.onTouchMove, this.handleMove)}
            onTouchCancel={callAll(this.props.onTouchCancel, this.handleStop)}
          />
        );
      }
    };
  };
}

// Export some commonly-used pre-wrapped components
//
const HoldableButton = holdable({ delay: 250 })(props => <button {...props} />);

export { HoldableButton };

export { MouseOrTouchEvent };
