#!/usr/bin/env bash
set -e

# No changes, skip release
readonly local last_release_commit_hash=$(git log --author="$GIT_USER" --pretty=format:"%H" -1)
echo "Last commit:    ${last_release_commit_hash} by $GIT_USER"
echo "Current commit: ${GITHUB_SHA}"
if [[ "${last_release_commit_hash}" = "${GITHUB_SHA}" ]]; then
     echo "No changes, skipping release"
     #exit 0
fi

# Config GIT
echo "Setup git user name to '$GIT_USER' and email to '$GIT_EMAIL'"
git config --global user.name "$GIT_USER";
git config --global user.email "$GIT_EMAIL";

# Checkout
git branch -a --contains ${GITHUB_SHA} --format="%(refname)"

readonly local refname=$(git branch -a --contains ${GITHUB_SHA} --format="%(refname)" | head -1)
if [[ "${refname}" = "refs/heads/main" ]]; then
     readonly local branch="main"
else
     readonly local branch=${refname#refs/remotes/origin/}
fi


# yarn
corepack enable
yarn set version 3.1.1
echo "Current yarn version: $(yarn -v)"
yarn install
yarn build

# Publish and Tag
readonly local PROJECT_VERSION=$(node -e "console.log(require('./package.json').version);")
echo "Git checkout refname: '${refname}' branch: '${branch}' commit: '${GITHUB_SHA}'"
echo "Project version: '${PROJECT_VERSION}'"
git tag -a ${PROJECT_VERSION} -m "Release: '${PROJECT_VERSION}'"
yarn npm publish --access public
git push origin --tags

# Next
git update-index --assume-unchanged .yarnrc.yml
yarn plugin import version
yarn version patch
readonly local PROJECT_VERSION_NEXT=$(node -e "console.log(require('./package.json').version);")
git commit -am "After release: '${PROJECT_VERSION_NEXT}'"
git push origin ${branch}
echo "Released: '${PROJECT_VERSION}', now: '${PROJECT_VERSION_NEXT}'"
