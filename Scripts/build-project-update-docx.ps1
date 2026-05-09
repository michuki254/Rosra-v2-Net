# Build a Word .docx project update from PROJECT-UPDATE-2026-05-04.md
# Renders headings, bullets and the small status table natively via the Word COM API.

$ErrorActionPreference = 'Stop'

$src    = Join-Path $PSScriptRoot '..\PROJECT-UPDATE-2026-05-04.md' | Resolve-Path
$outDir = Split-Path $src
$out    = Join-Path $outDir 'PROJECT-UPDATE-2026-05-04.docx'

$lines = Get-Content -LiteralPath $src -Encoding UTF8

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$sel = $word.Selection
$sel.ParagraphFormat.SpaceAfter = 6

function Write-Para([string]$style, [string]$text) {
    $sel.Style = $doc.Styles.Item($style)
    if ($text) { $sel.TypeText($text) }
    $sel.TypeParagraph()
}

function Write-RichLine([string]$text, [string]$style = 'Normal') {
    # Render very simple inline markdown: **bold** and `code` and links [t](u)
    $sel.Style = $doc.Styles.Item($style)
    $i = 0
    while ($i -lt $text.Length) {
        if ($i + 1 -lt $text.Length -and $text.Substring($i, 2) -eq '**') {
            $end = $text.IndexOf('**', $i + 2)
            if ($end -gt 0) {
                $sel.Font.Bold = $true
                $sel.TypeText($text.Substring($i + 2, $end - $i - 2))
                $sel.Font.Bold = $false
                $i = $end + 2
                continue
            }
        }
        if ($text[$i] -eq '`') {
            $end = $text.IndexOf('`', $i + 1)
            if ($end -gt 0) {
                $sel.Font.Name = 'Consolas'
                $sel.TypeText($text.Substring($i + 1, $end - $i - 1))
                $sel.Font.Name = 'Calibri'
                $i = $end + 1
                continue
            }
        }
        $sel.TypeText($text[$i])
        $i++
    }
    $sel.TypeParagraph()
}

# Walk the markdown and emit paragraphs / tables
$rows = @()
$inTable = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Tables: lines that start with '|'
    if ($line.StartsWith('|')) {
        $cells = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
        # Skip the separator row of dashes
        if (($cells | ForEach-Object { $_ -match '^[-: ]+$' }) -notcontains $false) {
            $inTable = $true
            continue
        }
        $rows += ,@($cells)
        $inTable = $true
        continue
    } elseif ($inTable) {
        # End of table: flush rows
        if ($rows.Count -gt 0) {
            $cols = $rows[0].Count
            $tbl = $doc.Tables.Add($sel.Range, $rows.Count, $cols)
            $tbl.Style = 'Grid Table 4 - Accent 1'
            for ($r = 0; $r -lt $rows.Count; $r++) {
                for ($c = 0; $c -lt $cols; $c++) {
                    $cell = $tbl.Cell($r + 1, $c + 1)
                    $cell.Range.Text = [string]$rows[$r][$c]
                }
            }
            $sel.EndOf() | Out-Null
            $sel.TypeParagraph()
            $rows = @()
        }
        $inTable = $false
    }

    # Skip top-of-file divider rules
    if ($line -match '^---\s*$') { Write-Para 'Normal' ''; continue }

    # Headings
    if ($line -match '^#\s+(.*)$') { Write-RichLine $matches[1] 'Heading 1'; continue }
    if ($line -match '^##\s+(.*)$') { Write-RichLine $matches[1] 'Heading 2'; continue }
    if ($line -match '^###\s+(.*)$') { Write-RichLine $matches[1] 'Heading 3'; continue }

    # Bullet list
    if ($line -match '^\s*-\s+(.*)$') { Write-RichLine $matches[1] 'List Bullet'; continue }
    # Numbered list
    if ($line -match '^\s*\d+\.\s+(.*)$') { Write-RichLine $matches[1] 'List Number'; continue }

    # Blank line
    if ($line -match '^\s*$') { $sel.TypeParagraph(); continue }

    # Default: a normal paragraph (with bold/code support)
    Write-RichLine $line 'Normal'
}

# Flush any trailing table
if ($rows.Count -gt 0) {
    $cols = $rows[0].Count
    $tbl = $doc.Tables.Add($sel.Range, $rows.Count, $cols)
    $tbl.Style = 'Grid Table 4 - Accent 1'
    for ($r = 0; $r -lt $rows.Count; $r++) {
        for ($c = 0; $c -lt $cols; $c++) {
            $tbl.Cell($r + 1, $c + 1).Range.Text = [string]$rows[$r][$c]
        }
    }
}

# Save and close. SaveAs2 is the modern entry point and accepts plain strings.
$wdFormatDocumentDefault = 16
$outPath = [string]$out
$doc.SaveAs2($outPath, $wdFormatDocumentDefault)
$doc.Close()
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($sel)  | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc)  | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null

"$out"
