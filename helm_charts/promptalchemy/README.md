In this tutorial, you will manage your OCR app by Helm.

## How-to Guide
```shell
k create secret generic promptalchemy-env --from-env-file=.env --namespace example
k describe secret promptalchemy-env -n example
```


```shell
cd promptalchemy
helm upgrade --install promptalchemy .
k port-forward promptalchemy-XXXXXXXXXX 30002:30000
```
