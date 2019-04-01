import * as React from 'react';

import styled from 'react-emotion';

const Title = styled('div')`
  font-weight: bold;
  margin-bottom: 0.5em;
  color: #0b5fff;
`;

function NoteBlock(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, ...extraProps } = props;
  return (
    <div {...props}>
      <Title>Note</Title> {props.children}
    </div>
  );
}

export const Note = styled(NoteBlock)`
  background: #eef1f5;
  padding: 10px;
`;
