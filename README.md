# BookMonkey

see [Angular Buch (iX 3. Ausgabe)](https://angular-buch.com/)

instead of  https://semantic-ui.com/ we use:
* [tailwindcss](https://tailwindcss.com/)
* [daisyui für tailwindcss](https://daisyui.com/)
* icons with [@dimaslz/ng-heroicons](https://github.com/dimaslz/ng-heroicons/blob/master/projects/ng-heroicons/README.md)

## additional stryker config optinos:
```
"ignorePatterns": ['**','!src/**/book-details*.ts'],
"logLevel": "trace",
"tempDirName": "stryker-tmp"
"inPlace": true
```
or use

`stryker run --ignorePatterns '**','!src/**/book-details*.ts'  --fileLogLevel trace`

## stryker Dashboard
- [Bodos Dashboard](https://dashboard.stryker-mutator.io/reports/github.com/bodote/book-monkey/master)

## Github Actions: 
### Deploy :
- use https://github.com/peaceiris/actions-gh-pages
- `npm run deploy` doesn't work inside an github action because of authentication problem
- instead we use:
```yaml
      - name: Deploy
        if: success()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist/book-monkey
          enable_jekyll: true

```
