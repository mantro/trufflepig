# TrufflePig

Search for secrets using the Shannon-Entropy in files, paths or local git repositories.

## Examples

```
#> node index --help

#> node index ~/path/to/local/git/repo

#> node index lib/*.js

#> node index file1.txt some/path and/a/git/repo anotherFile.txt

#> node index --color path/to/big/repo | less -r

```



# MacOS dependencies

```
brew install libgcrypt
```

## Todo

- [x] Add variadic arguments (globs)
- [x] Implement and test shannon algorithm
- [x] Implement good & self-explanatory CLI interface
- [x] Be able to search one file for secrets
- [x] Be able to search a set of files for secrets (extended glob)
- [x] Be able to search git history for secrets
- [x] Allow to change threshold of algorithm
- [x] Ability to change minimum word length
- [x] Should work with big files (~4 GB)
- [x] Implement colors
- [x] Add binary file detection
- [x] Switch to winston logging library
- [x] Harmonize output of scanFile and scanGit
- [x] Omit duplicates

## Decide?

- [ ] Adhere to .gitignore or not?
- [x] Which files to search?
- [ ] Create exceptions for GUID?
