# Manual source release checklist

CI stays deliberately lightweight: one Linux job runs `pnpm check:quick`. Full browser and distribution verification are explicit release work.

1. Choose a reviewed feature branch and update the root package version and changelog. Use a prerelease version while capability parity remains provisional. Regenerate through the normal commands; do not edit generated JSON or import maps.
2. Run `pnpm check:release`. This includes full build/package checks, all browser tests, source and packed consumer builds, the advertised CLI installation, formatting, production dependency audit, and tracked-file hygiene.
3. Run `pnpm performance:smoke`. Review `tmp/performance-smoke.json` and record environment, route/viewport medians, layout shifts, and resource sizes. These local lab samples are not field Core Web Vitals.
4. Review actual visual captures before accepting baseline changes. Run `pnpm test:e2e:visual --update-snapshots=all` only to prepare candidate captures, inspect them, then rerun without updating. Preserve tests in all three engines. Keep verification provisional for any capability lacking acceptance evidence. The current baseline set is reviewed on Windows; another operating system needs its own reviewed captures rather than silently replacing these files.
5. Inspect explicit staged files with `git diff --cached --check` and `git diff --cached --stat`. Confirm notices and licenses, exclude generated outputs and local artifacts, and commit the reviewed change.
6. Create an annotated local tag matching the version: `git tag -a v<VERSION> -m "BuildWithMe UI <VERSION>"`. Verify the tag references the reviewed commit. A local tag does not publish packages or deploy the site.
7. Push the branch/tag, create a GitHub release, publish npm packages, and deploy only as separately authorized release actions. Confirm scope ownership and real registry availability before enabling npm commands. Validate production public URLs with `pnpm env:validate` in the deployment environment.

Do not publish an error-free or production-ready claim based solely on compilation, test discovery, or green lightweight CI. Report actual passes, failures, environment limitations, and unverified behavior.
