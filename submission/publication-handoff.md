# Publication handoff

These steps cause public external changes and are intentionally held for the entrant.

## 1. Brand

Choose the final display name. The current temporary codename is **Project Mirror**; the neutral deployed slug is **belief-mirror**.

## 2. Live GPT-5.6

Add `OPENAI_API_KEY` as a secret production environment variable for the Sites project. Never put the key in `.env.example`, Git, Devpost, a screenshot, or the video.

After the environment revision is set, deploy the latest saved version again and test both:

- the deterministic seasons example; and
- one arbitrary concept that proves the live GPT-5.6 path.

## 3. Public app access

The Sites project is currently owner-only. Change access to public only after the final name and live environment are ready. Verify the URL in a private browser window.

## 4. Public repository

Create a public repository using the final name, push the `main` branch, and verify:

- MIT license is visible;
- README renders cleanly;
- no secret or rendered-media binary is tracked;
- commit history shows the project was built during the competition period; and
- the repository can be opened while signed out.

If kept private instead, share it with both required addresses: `testing@devpost.com` and `build-week-event@openai.com`.

## 5. Codex evidence

Run `/feedback` in the primary build task and paste the generated Session ID into Devpost. Do not substitute a thread ID from another task.

## 6. YouTube

Review the ready video, upload it publicly with the accompanying description, thumbnail, and SRT, then verify it while signed out.

## 7. Devpost

Paste the prepared description, choose **Education**, add the public app, repository, YouTube, and `/feedback` Session ID, then perform the final audit in `checklist.md` before submitting.
