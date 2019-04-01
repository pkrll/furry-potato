.PHONY: all node add commit push save

DRAFTS=drafts
STATIC=static
POSTS=index.json
P_APP=publisher.js

all: node add commit

node:
	node $(P_APP)

add:
	git add $(STATIC)
	git add $(POSTS)

commit:
	git commit -S -m "Published new post"

push:
	git push

save:
	git add $(DRAFTS)
	git commit -S -m "Saved draft"
