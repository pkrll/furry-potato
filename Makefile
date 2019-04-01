.PHONY: all node add commit push

INPUT=
POSTS=index.json
P_APP=publisher.js

all: node add commit

node:
	node $(P_APP) $(INPUT)

add:
	git add $(INPUT)
	git add $(POSTS)

commit:
	git commit -S -m "Added $$INPUT"

push:
	git push
