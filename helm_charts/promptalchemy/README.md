In this tutorial, you will manage your OCR app by Helm.

## How-to Guide
```shell
k create secret generic promptalchemy-env --from-env-file=.env --namespace promptalchemy
k describe secret promptalchemy-env -n promptalchemy
```


```shell
cd promptalchemy
helm upgrade --install promptalchemy .
k port-forward svc/promptalchemy 30000:30000
```
