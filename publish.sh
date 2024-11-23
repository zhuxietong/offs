#!/bin/bash

# Run TypeScript script to select packages
bun run select-packages.ts

# Read selected packages from file
SELECTED_PACKAGES=$(cat selected-packages.txt)

# Function to increment version
increment_version() {
  local version=$1
  local delimiter=.
  local array=($(echo "${version}" | tr $delimiter '\n'))
  array[$((${#array[@]} - 1))]=$((${array[$((${#array[@]} - 1))]} + 1))
  echo $(local IFS=$delimiter ; echo "${array[*]}")
}

# Process each selected package
for package_path in $SELECTED_PACKAGES
do
  echo "Processing package: $package_path"

  # Get package name from package.json
  package_name=$(jq -r .name "$package_path/package.json")

  # Get current version from npm
  current_version=$(npm view $package_name version)

  if [ $? -ne 0 ]; then
    echo "Error: Unable to fetch current version for $package_name. Skipping..."
    continue
  fi

  # Increment version
  new_version=$(increment_version $current_version)

  # Update package.json with new version
  jq ".version = \"$new_version\"" "$package_path/package.json" > temp.json && mv temp.json "$package_path/package.json"

  echo "Updated $package_name to version $new_version"

  # Compile TypeScript
  echo "Compiling TypeScript for $package_name..."
  cd $package_path
  # npm run build
  if [ $? -ne 0 ]; then
    echo "Error: TypeScript compilation failed for $package_name. Skipping publish..."
    cd -
    continue
  fi

  # Publish package
  echo "Publishing $package_name..."
  npm run build
  npm publish
  if [ $? -eq 0 ]; then
    echo "Successfully published $package_name@$new_version"
  else
    echo "Failed to publish $package_name"
  fi
  cd -
done

# Clean up
rm selected-packages.txt