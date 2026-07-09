on run argv
    if (count of argv) is not 2 then
        error "Usage: export_docx_to_pdf_word.applescript input.docx output.pdf"
    end if

    set inputPath to POSIX file (item 1 of argv)
    set outputPath to POSIX file (item 2 of argv)

    tell application "Microsoft Word"
        open inputPath
        set docHandle to active document
        save as docHandle file name outputPath file format format PDF
        close docHandle saving no
    end tell
end run
