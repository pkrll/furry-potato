.PHONY: all node add commit push

INPUT=
POSTS=index.json

all: node add commit

node:
	node app.js $(INPUT)

add:
	git add $(INPUT)
	git add $(POSTS)

commit:
	git commit -S -m "Added $$INPUT"

push:
	git push
