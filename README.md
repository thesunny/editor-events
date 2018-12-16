# Editor Events

Created to record composition events in a ContentEditable for Android browsers. Each API version of Android fires events in different order and quantities. This web app helps us understand these better.

It is specifically created for Android but should work equally well to diagnose and understand any browser.


## Features

- Captures relevant Native DOM events: Records all relevant DOM events. Ignores events like `mousemove` which would pollute the event log with too many entries and which would not be relevant anyways.

- Captures relevant React events: Captures all relevant React events.

- Captures DOM (HTML) changes: DOM changes in the ContentEditable are recorded in the log. This tells us at which point in the event firing order the DOM is updated. Note that this is the DOM as updated in the ContentEditable and is not related to React's updating of the DOM.

- Captures `requestAnimationFrame` and `setTimeout` events: When an event is fired from the ContentEditable, we start both a `requestAnimationFrame` and `setTimeout` callback. We then prevent new ones to start until the callback is executed. When the callback is executed, we log that. I think of these like transactions as all events in a group fire together. Note: `requestAnimationFrame` and `setTimeout` are started together but `requestAnimationFrame` is called first which may affect when the callback is called.


## To Do

- [ ] Create and Edit Scenarios
- [ ] Create and Delete Recordings
- [ ] Map User Agent to API versions (maybe created Tags automatically)
- [ ] View multiple recordings for a scenario side-by-side to compare them (maybe view them by ID for max flexibility)
- [ ] Tag scenarios (e.g. IME, gesture)
- [ ] Identify user's Android API version and show all scenarios that don't have a recording with the API version yet