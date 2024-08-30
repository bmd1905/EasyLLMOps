variable "project_id" {
  description = "The project ID to host the cluster in"
  type        = string
  default     = "prompt-alchemy"
}

variable "region" {
  description = "The region to host the cluster in"
  type        = string
  default     = "asia-southeast1-b"
}

variable "node_count" {
  description = "Number of nodes in the node pool"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "Machine type for the nodes"
  type        = string
  default     = "e2-highcpu-4"
}

variable "disk_size_gb" {
  description = "Disk size for the nodes in GB"
  type        = number
  default     = 30
}

variable "min_node_count" {
  description = "Minimum number of nodes in the node pool"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes in the node pool"
  type        = number
  default     = 3
}

variable "authorized_ipv4_cidr" {
  description = "The CIDR block for external access to the master"
  type        = string
  default     = "0.0.0.0/0"
}