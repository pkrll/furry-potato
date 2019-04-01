INDEX=index.json
INPUT=

all: node add commit

node:
	node app.js $(INPUT)

add:
	git add $(INPUT)
	git add $(INDEX)

commit:
	git commit -S -m "Added $$INPUT"

push:
	git push
