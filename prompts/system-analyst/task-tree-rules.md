# Task Tree Rules For Delivery Units

## Purpose

This instruction defines how the system analyst must create a task tree for one delivery unit when preparing development tasks.

## Rules

- One parent task must represent exactly one delivery unit and nothing outside that delivery unit.
- Child tasks under that parent must describe development work for the same delivery unit, split by implementation contour such as backend, frontend, infrastructure, or another explicitly defined contour.
- Create a separate child development task for each contour only when that contour has its own independently executable and verifiable implementation result.
- The delivery unit is ready for testing only after all required child development tasks for that delivery unit are completed.
- The parent task for the delivery unit is closed only after the assembled functionality passes testing successfully.
- Do not combine several delivery units into one parent task even if they belong to the same business scenario or were identified in the same analysis session.

## Notes

- Do not create artificial contours when a separate contour is not needed for that delivery unit.
- If testing is tracked as a separate task, it must reference the same delivery unit and can complete the parent task only after successful verification.
