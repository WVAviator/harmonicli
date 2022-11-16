import MainMenu, { MenuButtonItem } from './MainMenu';
import React, { FC } from 'react';
import { Text } from 'ink';
import { render } from 'ink-testing-library';
import removeANSI from '../../testing_utils/removeANSI';

const removeButton = (str: string) => str.replaceAll(/[─╮│╰╯╭ ]/g, '');

describe('MainMenu', () => {
    it('should render without errors', () => {
        const testItems: MenuButtonItem[] = [
            { label: 'Test', element: <></>, action: () => null },
            { label: 'Test2', element: <></>, action: () => null },
        ];
        const { lastFrame, unmount } = render(<MainMenu items={testItems}><Text>Test</Text></MainMenu>);
        const renderedOutput = lastFrame();

        expect(renderedOutput).not.toBeNull;
        expect(renderedOutput).not.toEqual('');

        unmount();
    });

    it('should switch focus between children', () => {

        const Test: FC<{ isFocused?: boolean }> = ({ isFocused }) => (
            <Text>{ isFocused ? 'Focused' : 'Unfocused' }</Text>
        );


        const testItems: MenuButtonItem[] = [
            { label: 'Unfocused', element: <Text>Focused</Text>, action: () => null },
        ];

        const testState = {
            buttonId: 0,
            childId: 0,
            buttonFocused: false,
            childBoxFocused: true,
            buttonBoxFocused: false,
        }

        const { frames, unmount, rerender } = render(
            <MainMenu items={testItems} testState={testState}>
                <Test />
                <Test />
                <Test />
                <Test />
            </MainMenu>
        );
        
        for (let i = 1; i < 4; i++) {
            testState.childId = i;
            rerender(
                <MainMenu items={testItems} testState={testState}>
                    <Test />
                    <Test />
                    <Test />
                    <Test />
                </MainMenu>
            );
        }

        expect(removeANSI(removeButton(frames[0]))).toEqual(`Focused\nUnfocused\nUnfocused\nUnfocused\n\nUnfocused\n`);
        expect(removeANSI(removeButton(frames[1]))).toEqual(`Unfocused\nFocused\nUnfocused\nUnfocused\n\nUnfocused\n`);
        expect(removeANSI(removeButton(frames[2]))).toEqual(`Unfocused\nUnfocused\nFocused\nUnfocused\n\nUnfocused\n`);
        expect(removeANSI(removeButton(frames[3]))).toEqual(`Unfocused\nUnfocused\nUnfocused\nFocused\n\nUnfocused\n`);

        unmount();
    });

    it('should switch focus between children and buttons', () => {

        const testItems: MenuButtonItem[] = [
            { label: 'Unfocused', element: <Text>Focused</Text>, action: () => null },
        ];

        const Test: FC<{ isFocused?: boolean }> = ({ isFocused }) => (
            <Text>{ isFocused ? 'Focused' : 'Unfocused' }</Text>
        );

        const testState = {
            buttonId: 0,
            childId: 0,
            buttonFocused: false,
            childBoxFocused: true,
            buttonBoxFocused: false,
        }

        const { frames, unmount, rerender } = render(
            <MainMenu items={testItems} testState={testState}>
                <Test />
            </MainMenu>
        );

        testState.childBoxFocused = false;
        testState.buttonBoxFocused = true;
        testState.buttonFocused = true;

        rerender(
            <MainMenu items={testItems} testState={testState}>
                <Test />
            </MainMenu>
        );

        expect(removeANSI(removeButton(frames[0]))).toEqual(`Focused\n\nUnfocused\n`);
        expect(removeANSI(removeButton(frames[1]))).toEqual(`Unfocused\n\nFocused\n`);

        unmount();
    });

    it('should have the focused button take up the full width', () => {
        const testItems: MenuButtonItem[] = [
            { label: 'Unfocused', element: <Text>Focused</Text>, action: () => null },
            { label: 'Unfocused1', element: <Text>Focused1</Text>, action: () => null },
            { label: 'Unfocused2', element: <Text>Focused2</Text>, action: () => null },
        ];

        const testState = {
            buttonId: 0,
            childId: 0,
            buttonFocused: false,
            childBoxFocused: false,
            buttonBoxFocused: true,
        }

        const { frames, unmount, rerender } = render(
            <MainMenu items={testItems} testState={testState}>
                <Text>Ignore</Text>
            </MainMenu>
        );


        for (let i = 1; i < 3; i++) {

            testState.buttonId = i;
            testState.buttonFocused = true;

            rerender(
                <MainMenu items={testItems} testState={testState}>
                    <Text>Ignore</Text>
                </MainMenu>
            );
        }


        expect(removeANSI(removeButton(frames[0]))).toEqual(`Ignore\n\nUnfocusedUnfocused1Unfocused2\n`);
        expect(removeANSI(removeButton(frames[1]))).toEqual(`Ignore\n\nFocused1\n`);
        expect(removeANSI(removeButton(frames[2]))).toEqual(`Ignore\n\nFocused2\n`);

        unmount();
    });
});
