# Phase 4: Testing & Quality Assurance

## 4.1 Test Plan

**Strategy**:
-   **Unit Testing**: Manual verification of individual API endpoints via Postman.
-   **Integration Testing**: End-to-end user flows (Login -> Quiz -> Result).
-   **UI Testing**: Visual regression testing against Figma mockups.

## 4.2 Test Cases

| ID | Description | Precondition | Steps | Expected Result | Status |
|----|-------------|--------------|-------|-----------------|--------|
| TC-01 | Valid Login | None | Enter Matric "19/Sc01" & Dept "CS", Click Start | Redirect to Home | PASS |
| TC-02 | Empty Login | None | Leave fields empty, Click Start | Error Message | PASS |
| TC-03 | Select Subject | Logged in | Click "Physics" card | Quiz starts (Q1 generic) | PASS |
| TC-04 | Correct Answer | Quiz Active | Click Correct Option | Green highlight + Checkmark | PASS |
| TC-05 | Wrong Answer | Quiz Active | Click Wrong Option | Red highlight + Explanation | PASS |
| TC-06 | Score Calculation | Quiz Done | Finish 5 questions (3 correct) | Result shows 3/5 | PASS |
| TC-07 | Leaderboard | 2+ Users | Navigate to Leaderboard | Sorting Correct (High to Low) | PASS |

## 4.3 Test Report
**Summary**: All critical paths (Happy Path) functioning correctly. Edge cases (Network failure) not fully tested in MVP scope.
**Bugs Found**: 0 Blocking bugs.
