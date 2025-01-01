#!/bin/bash

install_npm_dependencies() {
    local dir=$1
    shift
    for subdir in "$@"; do
        if [ -f "$dir/$subdir/package.json" ]; then
            echo "Running npm install in $dir$subdir"
            (cd "$dir/$subdir" && npm install)
        fi
    done
}

# Find all directories one level deep in the current directory
for dir in */; do
    case "$dir" in
    "verifier-demo/")
        install_npm_dependencies "$dir" "client" "server"
        ;;
    "padded-bloom-filter-cascade/")
        install_npm_dependencies "$dir" "." "bloomfilter-sha256"
        ;;
    *)
        if [ -f "$dir/package.json" ]; then
            install_npm_dependencies "$dir" "."
        fi
        ;;
    esac
done
