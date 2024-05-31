# Contributing guidelines

## Pull Request Checklist

Before sending your pull requests, make sure you do the following:

-   Read the [contributing guidelines](CONTRIBUTING.md).
-   Read the [Code of Conduct](CODE_OF_CONDUCT.md).
-   Ensure you have signed the
    [Contributor License Agreement (CLA)](https://cla.developers.google.com/).
-   Check if your changes are consistent with the
    [guidelines](#general-guidelines-and-philosophy-for-contribution).
-   Changes are consistent with the [Coding Style](#c-coding-style).
-   Run the [unit tests](#running-unit-tests).

## How to become a contributor and submit your own code

![Screen Shot 2022-08-30 at 7 27 04 PM](https://user-images.githubusercontent.com/42785357/187579207-9924eb32-da31-47bb-99f9-d8bf1aa238ad.png)

### Typical Pull Request Workflow -

**1. New PR**

- As a contributor, you submit a New PR on GitHub.
- We inspect every incoming PR and add certain labels to the PR such as `size:`,
  `comp:` etc.  At this stage we check if the PR is valid and meets certain
  quality requirements. For example, we check if the CLA is signed, PR has
  sufficient description, if applicable unit tests are added, if it is a
  reasonable contribution (meaning it is not a single liner cosmetic PR).

**2. Valid?**

-   If the PR passes all the quality checks then we go ahead and assign a
    reviewer.
-   If the PR didn't meet the validation criteria, we request for additional
    changes to be made to PR to pass quality checks and send it back or on a
    rare occasion we may reject it.

**3. Review**

-   For a valid PR, reviewer (person familiar with the code/functionality)
    checks if the PR looks good or needs additional changes.
-   If all looks good, the reviewer will approve the PR.
-   If a change is needed, the contributor is requested to make the suggested
    change.
-   You make the change and submit it for the review again.
-   This cycle repeats itself untill the PR gets approved.
-   Note: As a friendly reminder, we may reach out to you if the PR is awaiting
    your response for more than 2 weeks.

**4. Approved**

-   Once the PR is approved, it gets `kokoro:force-run` label applied and it
    initiates CI/CD tests.
-   We can't move forward if these tests fail.
-   In such situations, we may request you to make further changes to your PR
    for the tests to pass.
-   Once the tests pass, we now bring all the code into the internal code base,
    using a job called "copybara".

**5. Copy to Google Internal codebase and run internal CI**

-   Once the PR is in the Google codebase, we make sure it integrates well with
    its dependencies and the rest of the system.
-   Rarely, If the tests fail at this stage, we cannot merge the code.
-   If needed, we may come to you to make some changes. At times, it may not be
    you, it may be us who may have hit a snag. Please be patient while we work
    to fix this.
-   Once the internal tests pass, we go ahead and merge the code internally as
    well as externally on GitHub.

In a graphical form, the entire lifetime of a PR looks like

![image](https://user-images.githubusercontent.com/323199/229561784-0a2f5509-b731-493f-ad88-bad487688c8d.png)

### Contributor License Agreements

We'd love to accept your patches! Before we can take them, we have to jump a couple of legal hurdles.

Please fill out either the individual or corporate Contributor License Agreement (CLA).

  * If you are an individual writing original source code and you're sure you own the intellectual property, then you'll need to sign an [individual CLA](https://code.google.com/legal/individual-cla-v1.0.html).
  * If you work for a company that wants to allow you to contribute your work, then you'll need to sign a [corporate CLA](https://code.google.com/legal/corporate-cla-v1.0.html).

Follow either of the two links above to access the appropriate CLA and instructions for how to sign and return it. Once we receive it, we'll be able to accept your pull requests.

***NOTE***: Only original source code from you and other people that have signed the CLA can be accepted into the main repository.

### Contributing code

If you have improvements to TensorFlow, send us your pull requests! For those
just getting started, Github has a
[how to](https://help.github.com/articles/using-pull-requests/).

TensorFlow team members will be assigned to review your pull requests. Once the
pull requests are approved and pass continuous integration checks, a TensorFlow
team member will apply `ready to pull` label to your change. This means we are
working on getting your pull request submitted to our internal repository. After
the change has been submitted internally, your pull request will be merged
automatically on GitHub.

If you want to contribute, start working through the TensorFlow codebase,
navigate to the
[Github "issues" tab](https://github.com/tensorflow/tensorflow/issues) and start
looking through interesting issues. If you are not sure of where to start, then
start by trying one of the smaller/easier issues here i.e.
[issues with the "good first issue" label](https://github.com/tensorflow/tensorflow/labels/good%20first%20issue)
and then take a look at the
[issues with the "contributions welcome" label](https://github.com/tensorflow/tensorflow/labels/stat%3Acontributions%20welcome).
These are issues that we believe are particularly well suited for outside
contributions, often because we probably won't get to them right now. If you
decide to start on an issue, leave a comment so that other people know that
you're working on it. If you want to help out, but not alone, use the issue
comment thread to coordinate.

### Contribution guidelines and standards

Before sending your pull request for
[review](https://github.com/tensorflow/tensorflow/pulls),
make sure your changes are consistent with the guidelines and follow the
TensorFlow coding style.

#### General guidelines and philosophy for contribution

*   Include unit tests when you contribute new features, as they help to a)
    prove that your code works correctly, and b) guard against future breaking
    changes to lower the maintenance cost.
*   Bug fixes also generally require unit tests, because the presence of bugs
    usually indicates insufficient test coverage.
*   Keep API compatibility in mind when you change code in core TensorFlow,
    e.g., code in
    [tensorflow/core](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/core)
    and
    [tensorflow/python](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/python).
    TensorFlow has passed version 1.0 and hence cannot make
    non-backward-compatible API changes without a major release. Reviewers of
    your pull request will comment on any API compatibility issues
    [following API review practices](https://github.com/tensorflow/community/blob/master/governance/api-reviews.md).
*   When you contribute a new feature to TensorFlow, the maintenance burden is
    (by default) transferred to the TensorFlow team. This means that the benefit
    of the contribution must be compared against the cost of maintaining the
    feature.
*   Full new features (e.g., a new op implementing a cutting-edge algorithm)
    typically will live in
    [tensorflow/addons](https://github.com/tensorflow/addons) to get some
    airtime before a decision is made regarding whether they are to be migrated
    to the core.
*   As every PR requires several CPU/GPU hours of CI testing, we discourage
    submitting PRs to fix one typo, one warning,etc. We recommend fixing the
    same issue at the file level at least (e.g.: fix all typos in a file, fix
    all compiler warnings in a file, etc.)
*   Tests should follow the
    [testing best practices](https://www.tensorflow.org/community/contribute/tests)
    guide.
