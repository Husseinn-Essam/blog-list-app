#!/bin/bash

# Directory to rename files in, default to current directory if not provided
DIR=${1:-./}

# Loop through all .js files in the directory
for file in "$DIR"/*.js; do
  # Check if the file exists (in case there are no .js files)
  if [ -f "$file" ]; then
    # Get the base name of the file (without extension)
    base_name=$(basename "$file" .js)
    # Rename the file to .jsx
    mv "$file" "$DIR/$base_name.jsx"
    echo "Renamed $file to $DIR/$base_name.jsx"
  fi
done
