#!/bin/bash

input_folder="./"
output_folder="./"

find "$input_folder" -maxdepth 1 -type f -iname "*.jpg" -exec sh -c '
    for filepath do
        tga_filepath=$(mktemp).tga
        convert "$filepath" "$tga_filepath"
        output_filepath="$(basename "${filepath%.*}").moz.jpg"
        cjpeg -quality 70 -outfile "$output_filepath" "$tga_filepath"
        rm "$tga_filepath"
    done
' sh {} +
