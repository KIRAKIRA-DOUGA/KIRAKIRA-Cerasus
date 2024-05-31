## Git Branch Name Lint

> **develop** - main dev branch / test branch\
> **deployment** - deployment / release branch

#### Normal Bug Fix - **bugfix**

```
bugfix-<Date>-<FixedContentAbbrName>-<Creator>
```

#### Hot Fix - **hotfix**

```
hotfix-<Date>-<FixedContentAbbrName>-<Creator>
```

#### New Feature - **feature**

```
feature-<Date>-<ModifiedContentAbbrName>-<Creator>
```

#### Refactor - **refactoring**

```
refactoring-<Date>-<ModifiedContentAbbrName>-<Creator>
```

#### Locale - **locale**

```
locale-<Language>
```

---

#### Specific format

##### Date

The format is `yyyyMMddrr`, with a total of 8 digits.

Where\
`y` - Year; `M` - Month; `d` - Date; `r` - The revision number of the day, starting with 1.

##### Modified / Fixed Content Abbreviation Name

Named in Pascal form.

---

Create a development branch `feature-yyyyMMddrr-xxxxxxxx-xxxx` from the `develop` branch, then ***Merge*** back into development brance after the completion of development;

Perform unit testing on `feature`, and perform integration testing on `develop` (if possible);

***Merge*** the `develop` branch content to the `deployment` branch, and create a `tag`.

---

After creating your branch, ***Merge*** `develop` to your own branch, and resolve the conflicts;

Before you coding, ***Merge*** `develop` to your own branch, and resolve the conflicts;

After you finished coding, ***Merge*** `develop` to your own branch, and resolve the conflicts;

Before you merging, ***Merge*** `develop` to your own branch, and resolve the conflicts.
