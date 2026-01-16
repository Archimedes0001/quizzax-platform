# Test Plan Document
## Quizzax Assessment Platform

**Team Name:** Team Alpha  
**Phase:** 4.1  
**Date:** January 16, 2026

---

## 1. Testing Strategy
We employ a **hybrid testing strategy** combining manual and automated validation methods to ensure system reliability.
*   **Unit Testing**: Developers test individual functions (e.g., scoring logic) during implementation.
*   **Integration Testing**: Verifying data flow between Client and Server (e.g., login request -> DB lookup -> response).
*   **System Testing**: End-to-end validation of complete user flows (Login -> Quiz -> Result).
*   **User Acceptance Testing (UAT)**: Testing with 5 pilot students to verify usability.

## 2. Test Environment
*   **Hardware**: Windows 10/11 Laptops (Clients), Render Cloud Server (Host).
*   **Browser**: Chrome (v120+), Firefox (v115+).
*   **Network**: Simulated 3G/4G connections using Chrome DevTools.
*   **Database**: MongoDB Atlas "Test" Cluster (separate from Production).

---

# Test Cases Document
**Phase:** 4.2

| ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Verify valid login | Database seeded | 1. Enter valid Matric<br>2. Click Login | Redirect to Home | As Expected | **Pass** |
| **TC-02** | Verify invalid login | N/A | 1. Enter "INVALID"<br>2. Click Login | Error: "Unauthorized" | As Expected | **Pass** |
| **TC-03** | Verify empty field validation | N/A | 1. Leave blank<br>2. Click Login | Browser tooltip error | As Expected | **Pass** |
| **TC-04** | Verify SQL Injection attempt | N/A | 1. Enter `OR 1=1`<br>2. Click Login | Validated & Rejected | As Expected | **Pass** |
| **TC-05** | Verify Quiz Load | Logged in | 1. Click "Math" | Timer starts, Q1 shows | As Expected | **Pass** |
| **TC-06** | Verify Timer Countdown | Quiz Active | 1. Wait 1 min | Timer decreases | As Expected | **Pass** |
| **TC-07** | Verify Timer auto-submit | Quiz Active | 1. Set timer = 0 | Quiz submits auto | As Expected | **Pass** |
| **TC-08** | Verify Answer Selection | Quiz Active | 1. Click Option A | Option A highlights | As Expected | **Pass** |
| **TC-09** | Verify Navigation (Next) | Quiz Active | 1. Click Next | Shows Question 2 | As Expected | **Pass** |
| **TC-10** | Verify Navigation (Prev) | Quiz Active | 1. Click Prev | Shows Question 1 | As Expected | **Pass** |
| **TC-11** | Verify Flagging | Quiz Active | 1. Click Flag | Icon turns yellow | As Expected | **Pass** |
| **TC-12** | Verify Manual Submit | Quiz Active | 1. Click Submit | Modal appears | As Expected | **Pass** |
| **TC-13** | Verify Score Calculation | Attempt complete | 1. Submit 5/5 correct | Score = 100% | As Expected | **Pass** |
| **TC-14** | Verify History Update | Attempt complete | 1. Go to Profile | Attempt listed | As Expected | **Pass** |
| **TC-15** | Verify CA Calculation | 2 attempts done | 1. Check Avg | Avg is correct | As Expected | **Pass** |
| **TC-16** | Verify Logout | Logged in | 1. Click Logout | Redirect to Login | As Expected | **Pass** |
| **TC-17** | Verify 404 Page | N/A | 1. Bad URL | Redirect Home/Login | As Expected | **Pass** |
| **TC-18** | Verify Refresh Persistence | Quiz Active | 1. Refresh page | Resume at same Q | As Expected | **Pass** |
| **TC-19** | Verify Auto-Save | Quiz Active | 1. Select Ans <br>2. Wait 5s | Network Req sent | As Expected | **Pass** |
| **TC-20** | Verify Scrollbar Fix | Login Page | 1. Load Page | No flicker/scroll | As Expected | **Pass** |

---

# Test Report
**Phase:** 4.3

## 1. Execution Summary
*   **Total Tests**: 20
*   **Passed**: 20 (100%)
*   **Failed**: 0
*   **Skipped**: 0

## 2. Bugs Found and Resolved
*   **Bug #142 (Severity: Low)**: Scrollbar flickering on Login page.
    *   *Resolution*: Applied `overflow: hidden !important` to body/html css. **[FIXED]**
*   **Bug #105 (Severity: High)**: Performance page showing inactive users.
    *   *Resolution*: Added filter `user.history.length > 0`. **[FIXED]**

## 3. Overall Quality Assessment
The system is stable and meets all functional requirements. Authentication security (whitelist) is robust, and the critical "Session Persistence" feature has been verified across multiple browsers. Ready for deployment.
