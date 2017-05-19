include config.mk

BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/.bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] ]

run:
	wzrd app.js:index.js -- \
		-d \
		$(TRANSFORM_SWITCH)

build:
	$(BROWSERIFY) $(TRANSFORM_SWITCH) app.js | $(UGLIFY) -c -m -o index.js

test:
	node tests/basictests.js

pushall:
	git push origin gh-pages


oauth-signin:
	curl -v https://accounts.google.com/o/oauth2/auth?$(AUTH_QUERY_VALUE_ENCODED)

