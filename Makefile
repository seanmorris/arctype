.PHONY: all package clean

all: package

package:
	npx babel source/ArcType.js --out-dir .
	cp source/arctype.css .

dependencies:
	npm install

clean:
	rm -rf ArcType.js arctype.css
