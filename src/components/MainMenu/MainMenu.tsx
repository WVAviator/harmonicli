import React, { FC, ReactElement, useState } from 'react';
import { Box, Text, useInput } from 'ink';

export type MenuButtonItem = {
  label: string; // The label for the item.
  element?: ReactElement; // The actual element to display when the item is selected.
  action?: (id: number) => void; // An optional function to call when the item is selected.
};

interface MainMenuProps {
  items: MenuButtonItem[];
  children?: any;
  testState?: State;
}

type State = {
  buttonId: number;
  childId: number;
  buttonFocused: boolean;
  childBoxFocused: boolean;
  buttonBoxFocused: boolean;
};

type StateUnknown<T> = {
  [Prop in keyof T]?: T[Prop];
};

const MainMenu: FC<MainMenuProps> = ({ items, children, testState }) => {
  const [selected, setSelected] = useState<State>(
    testState ?? {
      buttonId: 0,
      childId: 0,
      buttonFocused: false,
      childBoxFocused: true,
      buttonBoxFocused: false,
    }
  );

  const selectedStateHelper = ({
    buttonId,
    childId,
    buttonFocused,
    childBoxFocused,
    buttonBoxFocused,
  }: StateUnknown<State>): State => {
    return {
      buttonId: buttonId ?? selected.buttonId,
      childId: childId ?? selected.childId,
      buttonFocused: buttonFocused ?? selected.buttonFocused,
      childBoxFocused: childBoxFocused ?? selected.childBoxFocused,
      buttonBoxFocused: buttonBoxFocused ?? selected.buttonBoxFocused,
    };
  };

  useInput((char, key) => {
    // Child box logic
    if (selected.childBoxFocused) {
      if (key.upArrow || char === 'k') {
        // If we are the top of the selected children, go to buttons
        if (selected.childId <= 0 && selected.childBoxFocused) {
          setSelected(
            selectedStateHelper({
              buttonBoxFocused: true,
              childBoxFocused: false,
              childId: Array.isArray(children) ? children.length - 1 : 0,
            })
          );
          return;
        }

        // Reset childId to last child if it goes out of bounds
        if (Array.isArray(children) && selected.childId < 0) {
          setSelected(
            selectedStateHelper({
              childId: 0,
            })
          );
          return;
        }

        // childID should always be 0 if there is only one
        if (!Array.isArray(children)) {
          return;
        }

        // Select previous child
        setSelected(
          selectedStateHelper({
            childId: selected.childId - 1,
          })
        );
      }

      if (key.downArrow || char === 'j') {
        // Shift focus to the button box if we run out of children.
        if (
          selected.childId >= children?.length - 1 &&
          selected.childBoxFocused
        ) {
          setSelected(
            selectedStateHelper({
              childBoxFocused: false,
              buttonBoxFocused: true,
            })
          );
          return;
        }

        // Reset childId to last child if it goes out of bounds
        if (Array.isArray(children) && selected.childId >= children.length) {
          setSelected(
            selectedStateHelper({
              childId: children.length - 1,
            })
          );
          return;
        }

        // childID should always be 0 if there is only one
        if (!Array.isArray(children)) {
          return;
        }

        // Select next child
        setSelected(
          selectedStateHelper({
            childId: selected.childId + 1,
          })
        );
      }
    }

    // Button box logic
    if (selected.buttonBoxFocused) {
      if (key.upArrow || char === 'k') {
        // If we're at the top row, go to child box
        if (selected.buttonId <= 2 && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonBoxFocused: false,
              childBoxFocused: true,
            })
          );
          return;
        }

        // Go up to the item above the current item.
        if (selected.buttonId - 3! < 0 && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId - 3,
            })
          );
          return;
        }
      }

      if (key.downArrow || char === 'j') {
        // If we're at the bottom row, go to child box
        if (selected.buttonId >= items.length - 2 && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonBoxFocused: false,
              childBoxFocused: true,
              childId: 0,
            })
          );
          return;
        }

        // Go down to the item below the current item.
        if (selected.buttonId + 3! >= items.length && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId + 3,
            })
          );
          return;
        }
      }

      if (key.leftArrow || char === 'h') {
        // Go to the previous item
        if (selected.buttonId !== 0 && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId - 1,
            })
          );
          return;
        }
      }

      if (key.rightArrow || char === 'l') {
        // Go to the next item
        if (selected.buttonId !== items.length - 1 && !selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId + 1,
            })
          );
          return;
        }
      }

      if (key.return) {
        // Enter focused item
        if (!selected.buttonFocused) {
          items[selected.buttonId].action(selected.buttonId);
          // setSelected( { id: selected.id, focused: !selected.buttonFocused, childrenSelected: false } );
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId,
              buttonFocused: !selected.buttonFocused,
            })
          );
          return;
        }
      }

      if (key.escape) {
        // Leave the focused item.
        if (selected.buttonFocused) {
          setSelected(
            selectedStateHelper({
              buttonId: selected.buttonId,
              buttonFocused: false,
            })
          );
          return;
        }
      }
    }
  });

  // This might be able to be refactored further.
  // Inner for loop is there due to the continue keyword.
  const mapRows = (items: MenuButtonItem[]) => {
    if (!items) new Error('No items provided to mapRows.');
    const cols = new Array(Math.ceil(items.length / 3)).fill(null);
    return cols.map((_, i) => {
      const row = [];
      for (let j = i; j < (i || 1) * 3; j++) {
        if (items[j] === undefined) continue;
        row.push(
          // TODO: Maybe break this to it's own Button component?
          <Box
            key={`box-${j}`}
            borderStyle="round"
            borderColor={
              selected.buttonId === j && selected.buttonBoxFocused
                ? 'yellow'
                : 'white'
            }
            width={selected.buttonFocused ? '100%' : 21}
            display={
              selected.buttonFocused && selected.buttonId !== j
                ? 'none'
                : 'flex'
            }
            flexDirection="row"
          >
            {selected.buttonFocused && selected.buttonId === j ? (
              items[j].element ?? <></>
            ) : (
              <Text>{items[j].label}</Text>
            )}
          </Box>
        );
      }
      return (
        <Box width="100%" key={`row-${i}`}>
          {row}
        </Box>
      );
    });
  };

  const addStateToChildren = (children) => {
    // Mutiple children
    if (Array.isArray(children)) {
      // Return children with selected state as prop
      return children.map((child, id) =>
        React.cloneElement(child, {
          key: id,
          isFocused: selected.childId === id && selected.childBoxFocused,
        })
      );
    }
    // Return child with selected state as prop
    return React.cloneElement(children, {
      isFocused: selected.childBoxFocused,
    });
  };

  return (
    <Box width="100%" flexDirection="column">
      {/* Children components (aka stuff you do not want inside the button rows) */}
      <Box flexDirection="column">{addStateToChildren(children)}</Box>

      {/* mapped items */}
      <Box width={64} flexDirection="column">
        {mapRows(items)}
      </Box>
    </Box>
  );
};

export default MainMenu;
