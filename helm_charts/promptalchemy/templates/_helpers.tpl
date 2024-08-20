{{/*
Return the full name of the application.
*/}}
{{- define "your-chart.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Return the name of the chart.
*/}}
{{- define "your-chart.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{/*
Get environment variables from a file
*/}}
{{- define "getEnvFile" -}}
{{- $envFile := .Files.Get ".env" -}}
{{- if $envFile -}}
{{- $env := dict -}}
{{- range $line := splitList "\n" $envFile -}}
  {{- $pair := splitList "=" $line -}}
  {{- if eq (len $pair) 2 -}}
    {{- $key := trim (index $pair 0 | toString) -}}
    {{- $value := trim (index $pair 1 | toString) -}}
    {{- if and $key $value -}}
      {{- $_ := set $env $key $value -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- $env | toYaml -}}
{{- else -}}
{{- fail ".env file not found" -}}
{{- end -}}
{{- end -}}
