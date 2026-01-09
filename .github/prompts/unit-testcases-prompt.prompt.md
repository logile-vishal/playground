File to be tested: src/core/components/rich-text-editor/Toolbar.tsx
Test Directory: src/core/components/rich-text-editor/tests
Component Name: Toolbar

Prompt:

Generate a complete, meaningful unit testcases for the given file inside the given directory. Create test file and mock file only for the mentioned Component Name inside the Test Directory mentioned above. For writing the test cases use vitest with modern patterns like vi.fn(), vi.spyOn, vi.mock(), RTL best practices for this React project with typescipt.

Additional context:
¯
Follow these rules for generating new unit test cases and files

1. Read the component file mentioned above, understand the structure properly. Read the imports file present in the File and understand the dependencies logic and then create the testcases by adding appropriate imports at the top of the test file and mock file.
2. Every component file named ComponentName.tsx must have a corresponding test file naming as ComponentName.test.tsx.
3. For mock prop values create a separate mock Data file inside test-directory/**mocks** folder like componentName.mocks.ts which should be specific to that component. The test file and mock file to be co-located with each component in its own directory. The componentName.mocks.ts file should contain mock data values with proper types with having all the required keys, mock functions definition and Spy function definitions.

4. Write complete, meaningful test cases for
   -Component rendering
   -Props handling
   -Event handling (clicks, inputs, selections, keyboard, etc.)
   -Conditional rendering logic
   -API calls (mocked)
   -Side effects (useEffect, timers)
   -Async behavior (loading, success, error states)
   -Edge cases, boundary conditions and negative scenarios
   -No Style testing required
   -All the possible edge cases for internal functions

5. While importing functions add proper path variables.

Example:

-In ExportMenu.test.tsx
import {mockFunction} from ‘./**mocks**/ExportMenu.mocks’
import ExportMenu from ‘../ExportMenu’

- In ExportMenu.mocks.ts
  import {someUtilFunction} from '@/core/types/export.type'

If the test file required to import from other directories then use absolute path only.

Example:
import {someUtilFunction} from '@/core/types/user.type'

6. After writing unit testing check for the unused import modules, functions, constants, methods and remove them. Do not import the local methods unnecessarily.

7. While rendering any component check for the proper types if the component type is not exported create the same type in the test file.

8. For timer related test cases functions handle the vitest fake timers properly by using vi.useFakeTimers() and vi.runAllTimers() and wrap the timer related code inside act().

9. For handling some edge scenarios follow below instructions,
   1- For adding negative test cases when creating mock error function always wrap inside try catch block and to handle the error function call use fireEvent.click and check number of calls happens.

   Example :

   fireEvent.click(button);
   expect(errorClick).toHaveBeenCalledTimes(1);

   2- For handling disabled button or icons use toBeDisabled().

Note:
For existing testcases for a given file above follow these below rules,

    1. Never delete any meaningful test cases.
    2. Never remove assertions that validate critical logic.
    3. Never break unit, integration, or behavioural test flows.
    4. Maintain all essential test coverage.
    5. If you think a test is redundant, mark it as a comment:

    // Review : Old Unit testcase review if still needed

    6. Fix the broken testcases and update outdated mocks or spy usage.
    7. Always check test coverage by adding new test blocks and always fix failing or flaky tests without deleting existing behaviour checks.
    8. Keep all mocks or spy functions inside the existing **mocks** folders which are co-located with each component in its own directory. If the **mocks** folder not created then follow the same naming conventions.

    9. If you think a test should be removed, Do not remove it. Comment it out and add short description why.

10. Review the test cases files and check if there is any issue in types or logic, fix them.

11. Follow these rules for reviewing and fixing the existing unit test cases and files

12. Never change the component files other than test files.
13. Read the component file mentioned above and understand it properly. Review the generated testcase file.
14. Check and fix the typescript issues, incorrect imports, missing mocks, logic errors and create the not exported component prop types in the test file if required.
