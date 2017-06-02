#!/bin/sh
#Script to create deb locally
export PACKAGE=$1
export TARGET=local
export INSTALL_BASE=dummy
export LOCAL_DIR=$(pwd)


bash make-$PACKAGE-deb
