# 맵 홈페이지(MAP homepage) : 개편
--------------------------------------------------------------------------
## 1. Gitlab Setting

- - -

### 1) Git global setup
* * *
    git config --global user.name "cristina"
    git config --global user.email "inyoung@dunamu.com"

### 2) Create a new repository
* * *
    git clone git@gitlab.dev.dunamu.com:publishing/map-homepage.git
    cd map-homepage
    touch README.md
    git add README.md
    git commit -m "add README"
    git push -u origin master

### 3) Existing folder

    cd existing_folder
    git init
    git remote add origin git@gitlab.dev.dunamu.com:publishing/map-homepage.git
    git add .
    git commit
    git push -u origin master

### 4) Existing Git repository

    cd existing_repo
    git remote add origin git@gitlab.dev.dunamu.com:publishing/map-homepage.git
    git push -u origin --all
    git push -u origin --tags