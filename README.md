# TrufflePig

Search for secrets and passwords using the Shannon-Entropy in files, paths or local git repositories.

This work is based on https://github.com/dxa4481/truffleHog, adding a few options here and there to fine tune the results. Also, I was unable to do it in python, so I did a cleanroom implementation in JS.

## Examples

```
#> node index --help

#> node index ~/path/to/local/git/repo

#> node index lib/*.js

#> node index file1.txt some/path and/a/git/repo anotherFile.txt

#> node index --color path/to/big/repo | less -r

#> node index -i *.xml,*.txt,*.csv path/to/something

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
- [x] Switch to console logging library
- [x] Harmonize output of scanFile and scanGit
- [x] Omit duplicates
- [x] Enable command line threshold specification
- [x] Add functionality to add ignore patterns from command line
- [ ] Test

## Decide?

- [ ] Adhere to .gitignore or not?
- [x] Which files to search?
- [ ] Create exceptions for GUID?
