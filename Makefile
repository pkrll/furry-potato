.PHONY: all node add commit push publish save

DRAFTS=drafts
STATIC=static
POSTS=index.json
P_APP=publisher.js

all:
	@echo "Usage: make [rule]\n\nrules:\npublish\t\tPublish a draft\nsave \t\tsave draft"

node:
	node $(P_APP)

add:
	git add $(STATIC)
	git add $(POSTS)

commit:
	git commit -S -m "Published new post"

push:
	git push

publish: node add commit

save:
	git add $(DRAFTS)
	git commit -S -m "Saved draft"
