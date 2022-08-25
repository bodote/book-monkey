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
- api_key = 21a448eb-b1c4-4166-94cb-a7d91af66499
- [Bodos Dashboard](https://dashboard.stryker-mutator.io/reports/github.com/bodote/book-monkey/master)
