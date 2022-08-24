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
