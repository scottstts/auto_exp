# Template documentation creation

## Steps

1. Download the template slides file as pdf and it should naturally be named as `Template Library.pptx.pdf` by default. Do not change it.

2. Place the pdf file in the `build_template_doc` folder.

3. Run [Template Extraction Script](extract.py) to populate the `template` folder with individual templates.

4. Check `template` folder and make sure all templates are extracted as individual folders, each containing the image of the template and the animation video demo.

5. Open [Building Docs Script](build_docs.py), specify which templates to build docs for in below part:

```python
# --- User-defined start and end range ---
# Specify the range of templates to process
START_TEMPLATE = 1
END_TEMPLATE = 22
# -----------------------------------------
```

6. Build individual documentations inside each template folder.

7. Check template folders to make sure all docs are built.

8. Run [Doc Concatenation Script](concat_docs.py) to build a concatenated docs file for all existing templates.