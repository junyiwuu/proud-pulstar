---
title: Git
description: remember details about how to use ssh key to push to github
---
## Git 

1. **initialize**: `git init`
2. **Add all**: `git add .`  (**be careful not add all your data**)
3. **Commit**: `git commit -m "comment...
	1. **Withdraw current commit**: 
		1. `git reset` = `git reset --mixed HEAD~1` : withdraw commit and staging area, keep working directory
		2. `git reset --soft HEAD~1`: withdraw commit, keep staging area and working directory
		3. `git reset --hard HEAD~1`: withdraw everything (dangerous)

4. **Ignore some files** : `touch .gitignore` `nano .gitignore`
5. **Check git status**: 
	1. `git status`
	2. `git diff` : check changes not in staging area
	3. `git diff --staged` : check changes already in the staging area
6. **Check what files been tracked**: `git ls-files`
	1.**Delete tracked files cache (not delete file itself :** `git rm -r --cached build/`
7. **Check current branch name**: `git branch`
	1. **Change the branch name**: `git branch -M main`
8. **Use SSH add to Github**: `git remote add origin git@github.com:username/repo.git
	* "origin" is how you call your remote repo, it can be changed to any other name, for example "myrepo"
	1. `git remote set-url origin git@github.com:username/repo.git`
	2. check current remote origin: `git remote -v`
		1. Delete current remote origin: `git remote remove origin`
		2. Add the remote origin you want:  `git remote add origin git@github.com:username/repo.git
9. **Push**: `git push -u origin main`
	* `-u`: set upstream, which means that by default, "main" branch will be push to "origin"(remote repo name) "main" branch. In the future, only need to write `git push`
10. **`.gitignore`:** 
	* ignore folder: `folder_name/`
	* ignore everything but only add certain folders/files: 
		```
		*
		!folder_name/
		```
	* ignore for example `__pycache__` in all recursive folders: `**/__pycache__/`
11.  **check current repo history:** 
	* Check all push history: `git log` (include author name, date, actions)
		*  `git log --oneline`: every log just one line
		* `git log --graph`: using graph way to show merge and branches
		* `git log --all` : show all branches pushes(not just current branch)
		* all together: `git log --oneline --graph --all`
		* exit log : `q`

---
## Git + ssh
### Generate ssh key
* List all ssh key currently own on the machine

```bash
ls -al ~/.ssh/
```

* Generate one 
`ssh-keygen -t ed25519 -C "your_email@example.com"`

* Check your public key
```bash
cat ~/.ssh/id_ed25519.pub
```

### How to push to Github
1. Add this SSH key in personal settings (not the individual repository! ). 
	* add to personal setting, the ssh key can be used on all repositories that belongs to this personal account
		* go to Github -> personal Settings -> SSH and GPG keys -> SSH keys
	* add to individual repository will make this key only available for this single repository
		* Go to github -> repo setting -> Deploy keys -> Add deploy key -> copy whole public key (from `cat ~/.ssh/id_ed25519.pub`)
2. In your repository on local machine:
	1. Check current remote address by using `git remote -v: 
		* if returns https, it sets on https, when you push, it will ask for username and password, and it is already deprecated by Github (sometimes even you already set remote address as ssh, bit it still show https,so need to double check)  ->
		* Change using HTTP  to SSH
		```bash
	git remote set-url origin git@github.com:username/repo.git
		```
		* if returns "git@github.com xxx" then you are on the right track

3.  Then `git push origin main`
* Check if SSH connection is good: `ssh -T git@github.com`, and it returns: `Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.`


---
## Branch

* **Switch branch**: `git checkout branch_name`
	*  `git checkout -b branch_name`: if branch_name not existed yet, will automatically create this branch
	* The commit will be applied to the current branch. When switch the branch, what you can see in the vscode will be changed immediately. 
* **Check branches:** `git branch`
* **Push branch to Github**: `git push -u origin branch_name`. It automatically create a remote branch: `origin/branch_name`
	* `-u`: `--set-upstream`, create the connection between current local branch and remote branch. After create this connection, next time can just type `git push` then it will push to the branch that you have set up.
	* use `git remote -v` to check the name of the remote repository





---
## Recursive
**Recursive clone**: `git clone --recurse-submodules <repo_url>`
If already cloned, **update recursive**: `git submodule update --init --recursive`
`git clone --recursive https://github.com/pytorch/pytorch`


---

## Issues:
### Failed to push some refs to ...
Reason: the remote repository might already have some files (license / readme file)
Solve:
* Can force push and overwrite files on remote: `git push -u origin main --force`
* Pull first if you want to keep them : `git pull origin main --allow-unrelated-histories`