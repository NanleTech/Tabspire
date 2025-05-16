.PHONY: build clean package all install

# Build and package the extension
build:
	chmod +x build.sh
	./build.sh

# Clean build artifacts
clean:
	rm -rf build
	rm -rf extension-package
	rm -f tabspire.zip

# Install dependencies
install:
	yarn install

# Build and package in one command
all: clean build 