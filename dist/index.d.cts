import { Agent, Response } from "undici";
import { SecureContextOptions } from "node:tls";
import * as stream$1 from "node:stream";
import stream, { Duplex, Writable } from "node:stream";
import { ReadableStream as ReadableStream$1, WritableStream } from "node:stream/web";
import { Socket } from "node:net";

//#region lib/types/FileInfo.d.ts
declare class FileInfo {
  name: string;
  size: number;
  mode: number;
  mtime: Date;
  linkTarget: string;
  constructor(name: string, size: number, mode: number, mtime: Date, linkTarget: string);
  static fromJSON(s: string): FileInfo;
}
//#endregion
//#region lib/types/Address.d.ts
/**
* Address represents an IPv4 or IPv6 IP address.
*/
interface Address {
  /**
  * IP address.
  */
  Addr?: string;
  /**
  * Mask length of the IP address.
  */
  PrefixLen?: number;
}
//#endregion
//#region lib/types/AuthConfig.d.ts
interface AuthConfig {
  username?: string;
  password?: string;
  /**
  * Email is an optional value associated with the username.  &gt; **Deprecated**: This field is deprecated since docker 1.11 (API v1.23) and will be removed in a future release.
  */
  email?: string;
  serveraddress?: string;
}
//#endregion
//#region lib/types/BuildCache.d.ts
/**
* BuildCache contains information about a build cache record.
*/
interface BuildCache {
  /**
  * Unique ID of the build cache record.
  */
  ID?: string;
  /**
  * ID of the parent build cache record.  &gt; **Deprecated**: This field is deprecated, and omitted if empty.
  */
  Parent?: string | null;
  /**
  * List of parent build cache record IDs.
  */
  Parents?: Array<string> | null;
  /**
  * Cache record type.
  */
  Type?: BuildCacheTypeEnum;
  /**
  * Description of the build-step that produced the build cache.
  */
  Description?: string;
  /**
  * Indicates if the build cache is in use.
  */
  InUse?: boolean;
  /**
  * Indicates if the build cache is shared.
  */
  Shared?: boolean;
  /**
  * Amount of disk space used by the build cache (in bytes).
  */
  Size?: number;
  /**
  * Date and time at which the build cache was created in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  CreatedAt?: string;
  /**
  * Date and time at which the build cache was last used in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  LastUsedAt?: string | null;
  UsageCount?: number;
}
type BuildCacheTypeEnum = "internal" | "frontend" | "source.local" | "source.git.checkout" | "exec.cachemount" | "regular";
//#endregion
//#region lib/types/BuildPruneResponse.d.ts
interface BuildPruneResponse {
  CachesDeleted?: Array<string>;
  /**
  * Disk space reclaimed in bytes
  */
  SpaceReclaimed?: number;
}
//#endregion
//#region lib/types/ChangeType.d.ts
/**
* Kind of change  Can be one of:  - `0`: Modified (\"C\") - `1`: Added (\"A\") - `2`: Deleted (\"D\")
*/
type ChangeType = 0 | 1 | 2;
//#endregion
//#region lib/types/ObjectVersion.d.ts
/**
* The version number of the object such as node, service, etc. This is needed to avoid conflicting writes. The client must send the version number along with the modified specification when updating these objects.  This approach ensures safe concurrency and determinism in that the change on the object may not be applied if the version number has changed from the last read. In other words, if two update requests specify the same base version, only one of the requests can succeed. As a result, two separate update requests that happen at the same time will not unintentionally overwrite each other.
*/
interface ObjectVersion {
  Index?: number;
}
//#endregion
//#region lib/types/SwarmSpecCAConfigExternalCAsInner.d.ts
interface SwarmSpecCAConfigExternalCAsInner {
  /**
  * Protocol for communication with the external CA (currently only &#x60;cfssl&#x60; is supported).
  */
  Protocol?: SwarmSpecCAConfigExternalCAsInnerProtocolEnum;
  /**
  * URL where certificate signing requests should be sent.
  */
  URL?: string;
  /**
  * An object with key/value pairs that are interpreted as protocol-specific options for the external CA driver.
  */
  Options?: {
    [key: string]: string;
  };
  /**
  * The root CA certificate (in PEM format) this external CA uses to issue TLS certificates (assumed to be to the current swarm root CA certificate if not provided).
  */
  CACert?: string;
}
type SwarmSpecCAConfigExternalCAsInnerProtocolEnum = "cfssl";
//#endregion
//#region lib/types/SwarmSpecCAConfig.d.ts
/**
* CA configuration.
*/
interface SwarmSpecCAConfig {
  /**
  * The duration node certificates are issued for.
  */
  NodeCertExpiry?: number;
  /**
  * Configuration for forwarding signing requests to an external certificate authority.
  */
  ExternalCAs?: Array<SwarmSpecCAConfigExternalCAsInner>;
  /**
  * The desired signing CA certificate for all swarm node TLS leaf certificates, in PEM format.
  */
  SigningCACert?: string;
  /**
  * The desired signing CA key for all swarm node TLS leaf certificates, in PEM format.
  */
  SigningCAKey?: string;
  /**
  * An integer whose purpose is to force swarm to generate a new signing CA certificate and key, if none have been specified in &#x60;SigningCACert&#x60; and &#x60;SigningCAKey&#x60;
  */
  ForceRotate?: number;
}
//#endregion
//#region lib/types/SwarmSpecDispatcher.d.ts
/**
* Dispatcher configuration.
*/
interface SwarmSpecDispatcher {
  /**
  * The delay for an agent to send a heartbeat to the dispatcher.
  */
  HeartbeatPeriod?: number;
}
//#endregion
//#region lib/types/SwarmSpecEncryptionConfig.d.ts
/**
* Parameters related to encryption-at-rest.
*/
interface SwarmSpecEncryptionConfig {
  /**
  * If set, generate a key and use it to lock data stored on the managers.
  */
  AutoLockManagers?: boolean;
}
//#endregion
//#region lib/types/SwarmSpecOrchestration.d.ts
/**
* Orchestration configuration.
*/
interface SwarmSpecOrchestration {
  /**
  * The number of historic tasks to keep per instance or node. If negative, never remove completed or failed tasks.
  */
  TaskHistoryRetentionLimit?: number;
}
//#endregion
//#region lib/types/SwarmSpecRaft.d.ts
/**
* Raft configuration.
*/
interface SwarmSpecRaft {
  /**
  * The number of log entries between snapshots.
  */
  SnapshotInterval?: number;
  /**
  * The number of snapshots to keep beyond the current snapshot.
  */
  KeepOldSnapshots?: number;
  /**
  * The number of log entries to keep around to sync up slow followers after a snapshot is created.
  */
  LogEntriesForSlowFollowers?: number;
  /**
  * The number of ticks that a follower will wait for a message from the leader before becoming a candidate and starting an election. &#x60;ElectionTick&#x60; must be greater than &#x60;HeartbeatTick&#x60;.  A tick currently defaults to one second, so these translate directly to seconds currently, but this is NOT guaranteed.
  */
  ElectionTick?: number;
  /**
  * The number of ticks between heartbeats. Every HeartbeatTick ticks, the leader will send a heartbeat to the followers.  A tick currently defaults to one second, so these translate directly to seconds currently, but this is NOT guaranteed.
  */
  HeartbeatTick?: number;
}
//#endregion
//#region lib/types/SwarmSpecTaskDefaultsLogDriver.d.ts
/**
* The log driver to use for tasks created in the orchestrator if unspecified by a service.  Updating this value only affects new tasks. Existing tasks continue to use their previously configured log driver until recreated.
*/
interface SwarmSpecTaskDefaultsLogDriver {
  /**
  * The log driver to use as a default for new tasks.
  */
  Name?: string;
  /**
  * Driver-specific options for the selected log driver, specified as key/value pairs.
  */
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/SwarmSpecTaskDefaults.d.ts
/**
* Defaults for creating tasks in this cluster.
*/
interface SwarmSpecTaskDefaults {
  LogDriver?: SwarmSpecTaskDefaultsLogDriver;
}
//#endregion
//#region lib/types/SwarmSpec.d.ts
/**
* User modifiable swarm configuration.
*/
interface SwarmSpec {
  /**
  * Name of the swarm.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  Orchestration?: SwarmSpecOrchestration | null;
  Raft?: SwarmSpecRaft;
  Dispatcher?: SwarmSpecDispatcher | null;
  CAConfig?: SwarmSpecCAConfig | null;
  EncryptionConfig?: SwarmSpecEncryptionConfig;
  TaskDefaults?: SwarmSpecTaskDefaults;
}
//#endregion
//#region lib/types/TLSInfo.d.ts
/**
* Information about the issuer of leaf TLS certificates and the trusted root CA certificate.
*/
interface TLSInfo {
  /**
  * The root CA certificate(s) that are used to validate leaf TLS certificates.
  */
  TrustRoot?: string;
  /**
  * The base64-url-safe-encoded raw subject bytes of the issuer.
  */
  CertIssuerSubject?: string;
  /**
  * The base64-url-safe-encoded raw public key bytes of the issuer.
  */
  CertIssuerPublicKey?: string;
}
//#endregion
//#region lib/types/ClusterInfo.d.ts
/**
* ClusterInfo represents information about the swarm as is returned by the \"/info\" endpoint. Join-tokens are not included.
*/
interface ClusterInfo {
  /**
  * The ID of the swarm.
  */
  ID?: string;
  Version?: ObjectVersion;
  /**
  * Date and time at which the swarm was initialised in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  CreatedAt?: string;
  /**
  * Date and time at which the swarm was last updated in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  UpdatedAt?: string;
  Spec?: SwarmSpec;
  TLSInfo?: TLSInfo;
  /**
  * Whether there is currently a root CA rotation in progress for the swarm
  */
  RootRotationInProgress?: boolean;
  /**
  * DataPathPort specifies the data path port number for data traffic. Acceptable port range is 1024 to 49151. If no port is set or is set to 0, the default port (4789) is used.
  */
  DataPathPort?: number;
  /**
  * Default Address Pool specifies default subnet pools for global scope networks.
  */
  DefaultAddrPool?: Array<string>;
  /**
  * SubnetSize specifies the subnet size of the networks created from the default subnet pool.
  */
  SubnetSize?: number;
}
//#endregion
//#region lib/types/ClusterVolumeInfo.d.ts
/**
* Information about the global status of the volume.
*/
interface ClusterVolumeInfo {
  /**
  * The capacity of the volume in bytes. A value of 0 indicates that the capacity is unknown.
  */
  CapacityBytes?: number;
  /**
  * A map of strings to strings returned from the storage plugin when the volume is created.
  */
  VolumeContext?: {
    [key: string]: string;
  };
  /**
  * The ID of the volume as returned by the CSI storage plugin. This is distinct from the volume\&#39;s ID as provided by Docker. This ID is never used by the user when communicating with Docker to refer to this volume. If the ID is blank, then the Volume has not been successfully created in the plugin yet.
  */
  VolumeID?: string;
  /**
  * The topology this volume is actually accessible from.
  */
  AccessibleTopology?: Array<{
    [key: string]: string;
  }>;
}
//#endregion
//#region lib/types/ClusterVolumePublishStatusInner.d.ts
interface ClusterVolumePublishStatusInner {
  /**
  * The ID of the Swarm node the volume is published on.
  */
  NodeID?: string;
  /**
  * The published state of the volume. * &#x60;pending-publish&#x60; The volume should be published to this node, but the call to the controller plugin to do so has not yet been successfully completed. * &#x60;published&#x60; The volume is published successfully to the node. * &#x60;pending-node-unpublish&#x60; The volume should be unpublished from the node, and the manager is awaiting confirmation from the worker that it has done so. * &#x60;pending-controller-unpublish&#x60; The volume is successfully unpublished from the node, but has not yet been successfully unpublished on the controller.
  */
  State?: ClusterVolumePublishStatusInnerStateEnum;
  /**
  * A map of strings to strings returned by the CSI controller plugin when a volume is published.
  */
  PublishContext?: {
    [key: string]: string;
  };
}
type ClusterVolumePublishStatusInnerStateEnum = "pending-publish" | "published" | "pending-node-unpublish" | "pending-controller-unpublish";
//#endregion
//#region lib/types/ClusterVolumeSpecAccessModeAccessibilityRequirements.d.ts
/**
* Requirements for the accessible topology of the volume. These fields are optional. For an in-depth description of what these fields mean, see the CSI specification.
*/
interface ClusterVolumeSpecAccessModeAccessibilityRequirements {
  /**
  * A list of required topologies, at least one of which the volume must be accessible from.
  */
  Requisite?: Array<{
    [key: string]: string;
  }>;
  /**
  * A list of topologies that the volume should attempt to be provisioned in.
  */
  Preferred?: Array<{
    [key: string]: string;
  }>;
}
//#endregion
//#region lib/types/ClusterVolumeSpecAccessModeCapacityRange.d.ts
/**
* The desired capacity that the volume should be created with. If empty, the plugin will decide the capacity.
*/
interface ClusterVolumeSpecAccessModeCapacityRange {
  /**
  * The volume must be at least this big. The value of 0 indicates an unspecified minimum
  */
  RequiredBytes?: number;
  /**
  * The volume must not be bigger than this. The value of 0 indicates an unspecified maximum.
  */
  LimitBytes?: number;
}
//#endregion
//#region lib/types/ClusterVolumeSpecAccessModeSecretsInner.d.ts
/**
* One cluster volume secret entry. Defines a key-value pair that is passed to the plugin.
*/
interface ClusterVolumeSpecAccessModeSecretsInner {
  /**
  * Key is the name of the key of the key-value pair passed to the plugin.
  */
  Key?: string;
  /**
  * Secret is the swarm Secret object from which to read data. This can be a Secret name or ID. The Secret data is retrieved by swarm and used as the value of the key-value pair passed to the plugin.
  */
  Secret?: string;
}
//#endregion
//#region lib/types/ClusterVolumeSpecAccessMode.d.ts
/**
* Defines how the volume is used by tasks.
*/
interface ClusterVolumeSpecAccessMode {
  /**
  * The set of nodes this volume can be used on at one time. - &#x60;single&#x60; The volume may only be scheduled to one node at a time. - &#x60;multi&#x60; the volume may be scheduled to any supported number of nodes at a time.
  */
  Scope?: ClusterVolumeSpecAccessModeScopeEnum;
  /**
  * The number and way that different tasks can use this volume at one time. - &#x60;none&#x60; The volume may only be used by one task at a time. - &#x60;readonly&#x60; The volume may be used by any number of tasks, but they all must mount the volume as readonly - &#x60;onewriter&#x60; The volume may be used by any number of tasks, but only one may mount it as read/write. - &#x60;all&#x60; The volume may have any number of readers and writers.
  */
  Sharing?: ClusterVolumeSpecAccessModeSharingEnum;
  /**
  * Options for using this volume as a Mount-type volume.      Either MountVolume or BlockVolume, but not both, must be     present.   properties:     FsType:       type: \&quot;string\&quot;       description: |         Specifies the filesystem type for the mount volume.         Optional.     MountFlags:       type: \&quot;array\&quot;       description: |         Flags to pass when mounting the volume. Optional.       items:         type: \&quot;string\&quot; BlockVolume:   type: \&quot;object\&quot;   description: |     Options for using this volume as a Block-type volume.     Intentionally empty.
  */
  MountVolume?: any;
  /**
  * Swarm Secrets that are passed to the CSI storage plugin when operating on this volume.
  */
  Secrets?: Array<ClusterVolumeSpecAccessModeSecretsInner>;
  AccessibilityRequirements?: ClusterVolumeSpecAccessModeAccessibilityRequirements;
  CapacityRange?: ClusterVolumeSpecAccessModeCapacityRange;
  /**
  * The availability of the volume for use in tasks. - &#x60;active&#x60; The volume is fully available for scheduling on the cluster - &#x60;pause&#x60; No new workloads should use the volume, but existing workloads are not stopped. - &#x60;drain&#x60; All workloads using this volume should be stopped and rescheduled, and no new ones should be started.
  */
  Availability?: ClusterVolumeSpecAccessModeAvailabilityEnum;
}
type ClusterVolumeSpecAccessModeScopeEnum = "single" | "multi";
type ClusterVolumeSpecAccessModeSharingEnum = "none" | "readonly" | "onewriter" | "all";
type ClusterVolumeSpecAccessModeAvailabilityEnum = "active" | "pause" | "drain";
//#endregion
//#region lib/types/ClusterVolumeSpec.d.ts
/**
* Cluster-specific options used to create the volume.
*/
interface ClusterVolumeSpec {
  /**
  * Group defines the volume group of this volume. Volumes belonging to the same group can be referred to by group name when creating Services.  Referring to a volume by group instructs Swarm to treat volumes in that group interchangeably for the purpose of scheduling. Volumes with an empty string for a group technically all belong to the same, emptystring group.
  */
  Group?: string;
  AccessMode?: ClusterVolumeSpecAccessMode;
}
//#endregion
//#region lib/types/ClusterVolume.d.ts
/**
* Options and information specific to, and only present on, Swarm CSI cluster volumes.
*/
interface ClusterVolume {
  /**
  * The Swarm ID of this volume. Because cluster volumes are Swarm objects, they have an ID, unlike non-cluster volumes. This ID can be used to refer to the Volume instead of the name.
  */
  ID?: string;
  Version?: ObjectVersion;
  CreatedAt?: string;
  UpdatedAt?: string;
  Spec?: ClusterVolumeSpec;
  Info?: ClusterVolumeInfo;
  /**
  * The status of the volume as it pertains to its publishing and use on specific nodes
  */
  PublishStatus?: Array<ClusterVolumePublishStatusInner>;
}
//#endregion
//#region lib/types/Commit.d.ts
/**
* Commit holds the Git-commit (SHA1) that a binary was built from, as reported in the version-string of external tools, such as `containerd`, or `runC`.
*/
interface Commit {
  /**
  * Actual commit ID of external tool.
  */
  ID?: string;
}
//#endregion
//#region lib/types/Driver.d.ts
/**
* Driver represents a driver (network, logging, secrets).
*/
interface Driver {
  /**
  * Name of the driver.
  */
  Name: string;
  /**
  * Key/value map of driver-specific options.
  */
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/ConfigSpec.d.ts
interface ConfigSpec {
  /**
  * User-defined name of the config.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Data is the data to store as a config, formatted as a Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)) string. The maximum allowed size is 1000KB, as defined in [MaxConfigSize](https://pkg.go.dev/github.com/moby/swarmkit/v2@v2.0.0-20250103191802-8c1959736554/manager/controlapi#MaxConfigSize).
  */
  Data?: string;
  Templating?: Driver;
}
//#endregion
//#region lib/types/Config.d.ts
interface Config {
  ID?: string;
  Version?: ObjectVersion;
  CreatedAt?: string;
  UpdatedAt?: string;
  Spec?: ConfigSpec;
}
//#endregion
//#region lib/types/ConfigCreateRequest.d.ts
interface ConfigCreateRequest {
  /**
  * User-defined name of the config.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Data is the data to store as a config, formatted as a Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)) string. The maximum allowed size is 1000KB, as defined in [MaxConfigSize](https://pkg.go.dev/github.com/moby/swarmkit/v2@v2.0.0-20250103191802-8c1959736554/manager/controlapi#MaxConfigSize).
  */
  Data?: string;
  Templating?: Driver;
}
//#endregion
//#region lib/types/ConfigReference.d.ts
/**
* The config-only network source to provide the configuration for this network.
*/
interface ConfigReference {
  /**
  * The name of the config-only network that provides the network\&#39;s configuration. The specified network must be an existing config-only network. Only network names are allowed, not network IDs.
  */
  Network?: string;
}
//#endregion
//#region lib/types/ContainerBlkioStatEntry.d.ts
/**
* Blkio stats entry.  This type is Linux-specific and omitted for Windows containers.
*/
interface ContainerBlkioStatEntry {
  major?: number;
  minor?: number;
  op?: string;
  value?: number;
}
//#endregion
//#region lib/types/ContainerBlkioStats.d.ts
/**
* BlkioStats stores all IO service stats for data read and write.  This type is Linux-specific and holds many fields that are specific to cgroups v1. On a cgroup v2 host, all fields other than `io_service_bytes_recursive` are omitted or `null`.  This type is only populated on Linux and omitted for Windows containers.
*/
interface ContainerBlkioStats {
  io_service_bytes_recursive?: Array<ContainerBlkioStatEntry>;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_serviced_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_queue_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_service_time_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_wait_time_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_merged_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  io_time_recursive?: Array<ContainerBlkioStatEntry> | null;
  /**
  * This field is only available when using Linux containers with cgroups v1. It is omitted or &#x60;null&#x60; when using cgroups v2.
  */
  sectors_recursive?: Array<ContainerBlkioStatEntry> | null;
}
//#endregion
//#region lib/types/ContainerCPUUsage.d.ts
/**
* All CPU stats aggregated since container inception.
*/
interface ContainerCPUUsage {
  /**
  * Total CPU time consumed in nanoseconds (Linux) or 100\&#39;s of nanoseconds (Windows).
  */
  total_usage?: number;
  /**
  * Total CPU time (in nanoseconds) consumed per core (Linux).  This field is Linux-specific when using cgroups v1. It is omitted when using cgroups v2 and Windows containers.
  */
  percpu_usage?: Array<number> | null;
  /**
  * Time (in nanoseconds) spent by tasks of the cgroup in kernel mode (Linux), or time spent (in 100\&#39;s of nanoseconds) by all container processes in kernel mode (Windows).  Not populated for Windows containers using Hyper-V isolation.
  */
  usage_in_kernelmode?: number;
  /**
  * Time (in nanoseconds) spent by tasks of the cgroup in user mode (Linux), or time spent (in 100\&#39;s of nanoseconds) by all container processes in kernel mode (Windows).  Not populated for Windows containers using Hyper-V isolation.
  */
  usage_in_usermode?: number;
}
//#endregion
//#region lib/types/ContainerThrottlingData.d.ts
/**
* CPU throttling stats of the container.  This type is Linux-specific and omitted for Windows containers.
*/
interface ContainerThrottlingData {
  /**
  * Number of periods with throttling active.
  */
  periods?: number;
  /**
  * Number of periods when the container hit its throttling limit.
  */
  throttled_periods?: number;
  /**
  * Aggregated time (in nanoseconds) the container was throttled for.
  */
  throttled_time?: number;
}
//#endregion
//#region lib/types/ContainerCPUStats.d.ts
/**
* CPU related info of the container
*/
interface ContainerCPUStats {
  cpu_usage?: ContainerCPUUsage | null;
  /**
  * System Usage.  This field is Linux-specific and omitted for Windows containers.
  */
  system_cpu_usage?: number | null;
  /**
  * Number of online CPUs.  This field is Linux-specific and omitted for Windows containers.
  */
  online_cpus?: number | null;
  throttling_data?: ContainerThrottlingData | null;
}
//#endregion
//#region lib/types/HealthConfig.d.ts
/**
* A test to perform to check that the container is healthy.
*/
interface HealthConfig {
  /**
  * The test to perform. Possible values are:  - &#x60;[]&#x60; inherit healthcheck from image or parent image - &#x60;[\&quot;NONE\&quot;]&#x60; disable healthcheck - &#x60;[\&quot;CMD\&quot;, args...]&#x60; exec arguments directly - &#x60;[\&quot;CMD-SHELL\&quot;, command]&#x60; run command with system\&#39;s default shell
  */
  Test?: Array<string>;
  /**
  * The time to wait between checks in nanoseconds. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
  */
  Interval?: number;
  /**
  * The time to wait before considering the check to have hung. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
  */
  Timeout?: number;
  /**
  * The number of consecutive failures needed to consider a container as unhealthy. 0 means inherit.
  */
  Retries?: number;
  /**
  * Start period for the container to initialize before starting health-retries countdown in nanoseconds. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
  */
  StartPeriod?: number;
  /**
  * The time to wait between checks in nanoseconds during the start period. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
  */
  StartInterval?: number;
}
//#endregion
//#region lib/types/ContainerConfig.d.ts
/**
* Configuration for a container that is portable between hosts.
*/
interface ContainerConfig {
  /**
  * The hostname to use for the container, as a valid RFC 1123 hostname.
  */
  Hostname?: string;
  /**
  * The domain name to use for the container.
  */
  Domainname?: string;
  /**
  * Commands run as this user inside the container. If omitted, commands run as the user specified in the image the container was started from.  Can be either user-name or UID, and optional group-name or GID, separated by a colon (&#x60;&lt;user-name|UID&gt;[&lt;:group-name|GID&gt;]&#x60;).
  */
  User?: string;
  /**
  * Whether to attach to &#x60;stdin&#x60;.
  */
  AttachStdin?: boolean;
  /**
  * Whether to attach to &#x60;stdout&#x60;.
  */
  AttachStdout?: boolean;
  /**
  * Whether to attach to &#x60;stderr&#x60;.
  */
  AttachStderr?: boolean;
  /**
  * An object mapping ports to an empty object in the form:  &#x60;{\&quot;&lt;port&gt;/&lt;tcp|udp|sctp&gt;\&quot;: {}}&#x60;
  */
  ExposedPorts?: {
    [key: string]: any;
  } | null;
  /**
  * Attach standard streams to a TTY, including &#x60;stdin&#x60; if it is not closed.
  */
  Tty?: boolean;
  /**
  * Open &#x60;stdin&#x60;
  */
  OpenStdin?: boolean;
  /**
  * Close &#x60;stdin&#x60; after one attached client disconnects
  */
  StdinOnce?: boolean;
  /**
  * A list of environment variables to set inside the container in the form &#x60;[\&quot;VAR&#x3D;value\&quot;, ...]&#x60;. A variable without &#x60;&#x3D;&#x60; is removed from the environment, rather than to have an empty value.
  */
  Env?: Array<string>;
  /**
  * Command to run specified as a string or an array of strings.
  */
  Cmd?: Array<string>;
  Healthcheck?: HealthConfig;
  /**
  * Command is already escaped (Windows only)
  */
  ArgsEscaped?: boolean | null;
  /**
  * The name (or reference) of the image to use when creating the container, or which was used when the container was created.
  */
  Image?: string;
  /**
  * An object mapping mount point paths inside the container to empty objects.
  */
  Volumes?: {
    [key: string]: any;
  };
  /**
  * The working directory for commands to run in.
  */
  WorkingDir?: string;
  /**
  * The entry point for the container as a string or an array of strings.  If the array consists of exactly one empty string (&#x60;[\&quot;\&quot;]&#x60;) then the entry point is reset to system default (i.e., the entry point used by docker when there is no &#x60;ENTRYPOINT&#x60; instruction in the &#x60;Dockerfile&#x60;).
  */
  Entrypoint?: Array<string>;
  /**
  * Disable networking for the container.
  */
  NetworkDisabled?: boolean | null;
  /**
  * MAC address of the container.  Deprecated: this field is deprecated in API v1.44 and up. Use EndpointSettings.MacAddress instead.
  */
  MacAddress?: string | null;
  /**
  * &#x60;ONBUILD&#x60; metadata that were defined in the image\&#39;s &#x60;Dockerfile&#x60;.
  */
  OnBuild?: Array<string> | null;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Signal to stop a container as a string or unsigned integer.
  */
  StopSignal?: string | null;
  /**
  * Timeout to stop a container in seconds.
  */
  StopTimeout?: number | null;
  /**
  * Shell for when &#x60;RUN&#x60;, &#x60;CMD&#x60;, and &#x60;ENTRYPOINT&#x60; uses a shell.
  */
  Shell?: Array<string> | null;
}
//#endregion
//#region lib/types/DeviceMapping.d.ts
/**
* A device mapping between the host and container
*/
interface DeviceMapping {
  PathOnHost?: string;
  PathInContainer?: string;
  CgroupPermissions?: string;
}
//#endregion
//#region lib/types/DeviceRequest.d.ts
/**
* A request for devices to be sent to device drivers
*/
interface DeviceRequest {
  /**
  * The name of the device driver to use for this request.  Note that if this is specified the capabilities are ignored when selecting a device driver.
  */
  Driver?: string;
  Count?: number;
  DeviceIDs?: Array<string>;
  /**
  * A list of capabilities; an OR list of AND lists of capabilities.  Note that if a driver is specified the capabilities have no effect on selecting a driver as the driver name is used directly.  Note that if no driver is specified the capabilities are used to select a driver with the required capabilities.
  */
  Capabilities?: Array<Array<string>>;
  /**
  * Driver-specific options, specified as a key/value pairs. These options are passed directly to the driver.
  */
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/HostConfigAllOfLogConfig.d.ts
/**
* The logging configuration for this container
*/
interface HostConfigAllOfLogConfig {
  /**
  * Name of the logging driver used for the container or \&quot;none\&quot; if logging is disabled.
  */
  Type?: HostConfigAllOfLogConfigTypeEnum;
  /**
  * Driver-specific configuration options for the logging driver.
  */
  Config?: {
    [key: string]: string;
  };
}
type HostConfigAllOfLogConfigTypeEnum = "local" | "json-file" | "syslog" | "journald" | "gelf" | "fluentd" | "awslogs" | "splunk" | "etwlogs" | "none";
//#endregion
//#region lib/types/MountBindOptions.d.ts
/**
* Optional configuration for the `bind` type.
*/
interface MountBindOptions {
  /**
  * A propagation mode with the value &#x60;[r]private&#x60;, &#x60;[r]shared&#x60;, or &#x60;[r]slave&#x60;.
  */
  Propagation?: MountBindOptionsPropagationEnum;
  /**
  * Disable recursive bind mount.
  */
  NonRecursive?: boolean;
  /**
  * Create mount point on host if missing
  */
  CreateMountpoint?: boolean;
  /**
  * Make the mount non-recursively read-only, but still leave the mount recursive (unless NonRecursive is set to &#x60;true&#x60; in conjunction).  Added in v1.44, before that version all read-only mounts were non-recursive by default. To match the previous behaviour this will default to &#x60;true&#x60; for clients on versions prior to v1.44.
  */
  ReadOnlyNonRecursive?: boolean;
  /**
  * Raise an error if the mount cannot be made recursively read-only.
  */
  ReadOnlyForceRecursive?: boolean;
}
type MountBindOptionsPropagationEnum = "private" | "rprivate" | "shared" | "rshared" | "slave" | "rslave";
//#endregion
//#region lib/types/MountImageOptions.d.ts
/**
* Optional configuration for the `image` type.
*/
interface MountImageOptions {
  /**
  * Source path inside the image. Must be relative without any back traversals.
  */
  Subpath?: string;
}
//#endregion
//#region lib/types/MountTmpfsOptions.d.ts
/**
* Optional configuration for the `tmpfs` type.
*/
interface MountTmpfsOptions {
  /**
  * The size for the tmpfs mount in bytes.
  */
  SizeBytes?: number;
  /**
  * The permission mode for the tmpfs mount in an integer.
  */
  Mode?: number;
  /**
  * The options to be passed to the tmpfs mount. An array of arrays. Flag options should be provided as 1-length arrays. Other types should be provided as as 2-length arrays, where the first item is the key and the second the value.
  */
  Options?: Array<Array<string>>;
}
//#endregion
//#region lib/types/MountVolumeOptionsDriverConfig.d.ts
/**
* Map of driver specific options
*/
interface MountVolumeOptionsDriverConfig {
  /**
  * Name of the driver to use to create the volume.
  */
  Name?: string;
  /**
  * key/value map of driver specific options.
  */
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/MountVolumeOptions.d.ts
/**
* Optional configuration for the `volume` type.
*/
interface MountVolumeOptions {
  /**
  * Populate volume with data from the target.
  */
  NoCopy?: boolean;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  DriverConfig?: MountVolumeOptionsDriverConfig;
  /**
  * Source path inside the volume. Must be relative without any back traversals.
  */
  Subpath?: string;
}
//#endregion
//#region lib/types/Mount.d.ts
interface Mount {
  /**
  * Container path.
  */
  Target?: string;
  /**
  * Mount source (e.g. a volume name, a host path).
  */
  Source?: string;
  /**
  * The mount type. Available types:  - &#x60;bind&#x60; Mounts a file or directory from the host into the container. Must exist prior to creating the container. - &#x60;volume&#x60; Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed. - &#x60;image&#x60; Mounts an image. - &#x60;tmpfs&#x60; Create a tmpfs with the given options. The mount source cannot be specified for tmpfs. - &#x60;npipe&#x60; Mounts a named pipe from the host into the container. Must exist prior to creating the container. - &#x60;cluster&#x60; a Swarm cluster volume
  */
  Type?: MountTypeEnum;
  /**
  * Whether the mount should be read-only.
  */
  ReadOnly?: boolean;
  /**
  * The consistency requirement for the mount: &#x60;default&#x60;, &#x60;consistent&#x60;, &#x60;cached&#x60;, or &#x60;delegated&#x60;.
  */
  Consistency?: string;
  BindOptions?: MountBindOptions;
  VolumeOptions?: MountVolumeOptions;
  ImageOptions?: MountImageOptions;
  TmpfsOptions?: MountTmpfsOptions;
}
type MountTypeEnum = "bind" | "volume" | "image" | "tmpfs" | "npipe" | "cluster";
//#endregion
//#region lib/types/PortBinding.d.ts
/**
* PortBinding represents a binding between a host IP address and a host port.
*/
interface PortBinding {
  /**
  * Host IP address that the container\&#39;s port is mapped to.
  */
  HostIp?: string;
  /**
  * Host port number that the container\&#39;s port is mapped to.
  */
  HostPort?: string;
}
//#endregion
//#region lib/types/ResourcesBlkioWeightDeviceInner.d.ts
interface ResourcesBlkioWeightDeviceInner {
  Path?: string;
  Weight?: number;
}
//#endregion
//#region lib/types/ResourcesUlimitsInner.d.ts
interface ResourcesUlimitsInner {
  /**
  * Name of ulimit
  */
  Name?: string;
  /**
  * Soft limit
  */
  Soft?: number;
  /**
  * Hard limit
  */
  Hard?: number;
}
//#endregion
//#region lib/types/RestartPolicy.d.ts
/**
* The behavior to apply when the container exits. The default is not to restart.  An ever increasing delay (double the previous delay, starting at 100ms) is added before each restart to prevent flooding the server.
*/
interface RestartPolicy {
  /**
  * - Empty string means not to restart - &#x60;no&#x60; Do not automatically restart - &#x60;always&#x60; Always restart - &#x60;unless-stopped&#x60; Restart always except when the user has manually stopped the container - &#x60;on-failure&#x60; Restart only when the container exit code is non-zero
  */
  Name?: RestartPolicyNameEnum;
  /**
  * If &#x60;on-failure&#x60; is used, the number of times to retry before giving up.
  */
  MaximumRetryCount?: number;
}
type RestartPolicyNameEnum = "" | "no" | "always" | "unless-stopped" | "on-failure";
//#endregion
//#region lib/types/ThrottleDevice.d.ts
interface ThrottleDevice {
  /**
  * Device path
  */
  Path?: string;
  /**
  * Rate
  */
  Rate?: number;
}
//#endregion
//#region lib/types/HostConfig.d.ts
/**
* Container configuration that depends on the host we are running on
*/
interface HostConfig {
  /**
  * An integer value representing this container\&#39;s relative CPU weight versus other containers.
  */
  CpuShares?: number;
  /**
  * Memory limit in bytes.
  */
  Memory?: number;
  /**
  * Path to &#x60;cgroups&#x60; under which the container\&#39;s &#x60;cgroup&#x60; is created. If the path is not absolute, the path is considered to be relative to the &#x60;cgroups&#x60; path of the init process. Cgroups are created if they do not already exist.
  */
  CgroupParent?: string;
  /**
  * Block IO weight (relative weight).
  */
  BlkioWeight?: number;
  /**
  * Block IO weight (relative device weight) in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Weight\&quot;: weight}] &#x60;&#x60;&#x60;
  */
  BlkioWeightDevice?: Array<ResourcesBlkioWeightDeviceInner>;
  /**
  * Limit read rate (bytes per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadBps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (bytes per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteBps?: Array<ThrottleDevice>;
  /**
  * Limit read rate (IO per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadIOps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (IO per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
  /**
  * The length of a CPU period in microseconds.
  */
  CpuPeriod?: number;
  /**
  * Microseconds of CPU time that the container can get in a CPU period.
  */
  CpuQuota?: number;
  /**
  * The length of a CPU real-time period in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimePeriod?: number;
  /**
  * The length of a CPU real-time runtime in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimeRuntime?: number;
  /**
  * CPUs in which to allow execution (e.g., &#x60;0-3&#x60;, &#x60;0,1&#x60;).
  */
  CpusetCpus?: string;
  /**
  * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only effective on NUMA systems.
  */
  CpusetMems?: string;
  /**
  * A list of devices to add to the container.
  */
  Devices?: Array<DeviceMapping>;
  /**
  * a list of cgroup rules to apply to the container
  */
  DeviceCgroupRules?: Array<string>;
  /**
  * A list of requests for devices to be sent to device drivers.
  */
  DeviceRequests?: Array<DeviceRequest>;
  /**
  * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI runtime in use, this option may be ignored. It is no longer supported by the default (runc) runtime.  This field is omitted when empty.
  */
  KernelMemoryTCP?: number;
  /**
  * Memory soft limit in bytes.
  */
  MemoryReservation?: number;
  /**
  * Total memory limit (memory + swap). Set as &#x60;-1&#x60; to enable unlimited swap.
  */
  MemorySwap?: number;
  /**
  * Tune a container\&#39;s memory swappiness behavior. Accepts an integer between 0 and 100.
  */
  MemorySwappiness?: number;
  /**
  * CPU quota in units of 10&lt;sup&gt;-9&lt;/sup&gt; CPUs.
  */
  NanoCpus?: number;
  /**
  * Disable OOM Killer for the container.
  */
  OomKillDisable?: boolean;
  /**
  * Run an init inside the container that forwards signals and reaps processes. This field is omitted if empty, and the default (as configured on the daemon) is used.
  */
  Init?: boolean | null;
  /**
  * Tune a container\&#39;s PIDs limit. Set &#x60;0&#x60; or &#x60;-1&#x60; for unlimited, or &#x60;null&#x60; to not change.
  */
  PidsLimit?: number | null;
  /**
  * A list of resource limits to set in the container. For example:  &#x60;&#x60;&#x60; {\&quot;Name\&quot;: \&quot;nofile\&quot;, \&quot;Soft\&quot;: 1024, \&quot;Hard\&quot;: 2048} &#x60;&#x60;&#x60;
  */
  Ulimits?: Array<ResourcesUlimitsInner>;
  /**
  * The number of usable CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuCount?: number;
  /**
  * The usable percentage of the available CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuPercent?: number;
  /**
  * Maximum IOps for the container system drive (Windows only)
  */
  IOMaximumIOps?: number;
  /**
  * Maximum IO in bytes per second for the container system drive (Windows only).
  */
  IOMaximumBandwidth?: number;
  /**
  * A list of volume bindings for this container. Each volume binding is a string in one of these forms:  - &#x60;host-src:container-dest[:options]&#x60; to bind-mount a host path   into the container. Both &#x60;host-src&#x60;, and &#x60;container-dest&#x60; must   be an _absolute_ path. - &#x60;volume-name:container-dest[:options]&#x60; to bind-mount a volume   managed by a volume driver into the container. &#x60;container-dest&#x60;   must be an _absolute_ path.  &#x60;options&#x60; is an optional, comma-delimited list of:  - &#x60;nocopy&#x60; disables automatic copying of data from the container   path to the volume. The &#x60;nocopy&#x60; flag only applies to named volumes. - &#x60;[ro|rw]&#x60; mounts a volume read-only or read-write, respectively.   If omitted or set to &#x60;rw&#x60;, volumes are mounted read-write. - &#x60;[z|Z]&#x60; applies SELinux labels to allow or deny multiple containers   to read and write to the same volume.     - &#x60;z&#x60;: a _shared_ content label is applied to the content. This       label indicates that multiple containers can share the volume       content, for both reading and writing.     - &#x60;Z&#x60;: a _private unshared_ label is applied to the content.       This label indicates that only the current container can use       a private volume. Labeling systems such as SELinux require       proper labels to be placed on volume content that is mounted       into a container. Without a label, the security system can       prevent a container\&#39;s processes from using the content. By       default, the labels set by the host operating system are not       modified. - &#x60;[[r]shared|[r]slave|[r]private]&#x60; specifies mount   [propagation behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).   This only applies to bind-mounted volumes, not internal volumes   or named volumes. Mount propagation requires the source mount   point (the location where the source directory is mounted in the   host operating system) to have the correct propagation properties.   For shared volumes, the source mount point must be set to &#x60;shared&#x60;.   For slave volumes, the mount must be set to either &#x60;shared&#x60; or   &#x60;slave&#x60;.
  */
  Binds?: Array<string>;
  /**
  * Path to a file where the container ID is written
  */
  ContainerIDFile?: string;
  LogConfig?: HostConfigAllOfLogConfig;
  /**
  * Network mode to use for this container. Supported standard values are: &#x60;bridge&#x60;, &#x60;host&#x60;, &#x60;none&#x60;, and &#x60;container:&lt;name|id&gt;&#x60;. Any other value is taken as a custom network\&#39;s name to which this container should connect to.
  */
  NetworkMode?: string;
  /**
  * PortMap describes the mapping of container ports to host ports, using the container\&#39;s port-number and protocol as key in the format &#x60;&lt;port&gt;/&lt;protocol&gt;&#x60;, for example, &#x60;80/udp&#x60;.  If a container\&#39;s port is mapped for multiple protocols, separate entries are added to the mapping table.
  */
  PortBindings?: {
    [key: string]: Array<PortBinding> | null;
  };
  RestartPolicy?: RestartPolicy;
  /**
  * Automatically remove the container when the container\&#39;s process exits. This has no effect if &#x60;RestartPolicy&#x60; is set.
  */
  AutoRemove?: boolean;
  /**
  * Driver that this container uses to mount volumes.
  */
  VolumeDriver?: string;
  /**
  * A list of volumes to inherit from another container, specified in the form &#x60;&lt;container name&gt;[:&lt;ro|rw&gt;]&#x60;.
  */
  VolumesFrom?: Array<string>;
  /**
  * Specification for mounts to be added to the container.
  */
  Mounts?: Array<Mount>;
  /**
  * Initial console size, as an &#x60;[height, width]&#x60; array.
  */
  ConsoleSize?: Array<number> | null;
  /**
  * Arbitrary non-identifying metadata attached to container and provided to the runtime when the container is started.
  */
  Annotations?: {
    [key: string]: string;
  };
  /**
  * A list of kernel capabilities to add to the container. Conflicts with option \&#39;Capabilities\&#39;.
  */
  CapAdd?: Array<string>;
  /**
  * A list of kernel capabilities to drop from the container. Conflicts with option \&#39;Capabilities\&#39;.
  */
  CapDrop?: Array<string>;
  /**
  * cgroup namespace mode for the container. Possible values are:  - &#x60;\&quot;private\&quot;&#x60;: the container runs in its own private cgroup namespace - &#x60;\&quot;host\&quot;&#x60;: use the host system\&#39;s cgroup namespace  If not specified, the daemon default is used, which can either be &#x60;\&quot;private\&quot;&#x60; or &#x60;\&quot;host\&quot;&#x60;, depending on daemon version, kernel support and configuration.
  */
  CgroupnsMode?: HostConfigCgroupnsModeEnum;
  /**
  * A list of DNS servers for the container to use.
  */
  Dns?: Array<string>;
  /**
  * A list of DNS options.
  */
  DnsOptions?: Array<string>;
  /**
  * A list of DNS search domains.
  */
  DnsSearch?: Array<string>;
  /**
  * A list of hostnames/IP mappings to add to the container\&#39;s &#x60;/etc/hosts&#x60; file. Specified in the form &#x60;[\&quot;hostname:IP\&quot;]&#x60;.
  */
  ExtraHosts?: Array<string>;
  /**
  * A list of additional groups that the container process will run as.
  */
  GroupAdd?: Array<string>;
  /**
  * IPC sharing mode for the container. Possible values are:  - &#x60;\&quot;none\&quot;&#x60;: own private IPC namespace, with /dev/shm not mounted - &#x60;\&quot;private\&quot;&#x60;: own private IPC namespace - &#x60;\&quot;shareable\&quot;&#x60;: own private IPC namespace, with a possibility to share it with other containers - &#x60;\&quot;container:&lt;name|id&gt;\&quot;&#x60;: join another (shareable) container\&#39;s IPC namespace - &#x60;\&quot;host\&quot;&#x60;: use the host system\&#39;s IPC namespace  If not specified, daemon default is used, which can either be &#x60;\&quot;private\&quot;&#x60; or &#x60;\&quot;shareable\&quot;&#x60;, depending on daemon version and configuration.
  */
  IpcMode?: string;
  /**
  * Cgroup to use for the container.
  */
  Cgroup?: string;
  /**
  * A list of links for the container in the form &#x60;container_name:alias&#x60;.
  */
  Links?: Array<string>;
  /**
  * An integer value containing the score given to the container in order to tune OOM killer preferences.
  */
  OomScoreAdj?: number;
  /**
  * Set the PID (Process) Namespace mode for the container. It can be either:  - &#x60;\&quot;container:&lt;name|id&gt;\&quot;&#x60;: joins another container\&#39;s PID namespace - &#x60;\&quot;host\&quot;&#x60;: use the host\&#39;s PID namespace inside the container
  */
  PidMode?: string;
  /**
  * Gives the container full access to the host.
  */
  Privileged?: boolean;
  /**
  * Allocates an ephemeral host port for all of a container\&#39;s exposed ports.  Ports are de-allocated when the container stops and allocated when the container starts. The allocated port might be changed when restarting the container.  The port is selected from the ephemeral port range that depends on the kernel. For example, on Linux the range is defined by &#x60;/proc/sys/net/ipv4/ip_local_port_range&#x60;.
  */
  PublishAllPorts?: boolean;
  /**
  * Mount the container\&#39;s root filesystem as read only.
  */
  ReadonlyRootfs?: boolean;
  /**
  * A list of string values to customize labels for MLS systems, such as SELinux.
  */
  SecurityOpt?: Array<string>;
  /**
  * Storage driver options for this container, in the form &#x60;{\&quot;size\&quot;: \&quot;120G\&quot;}&#x60;.
  */
  StorageOpt?: {
    [key: string]: string;
  };
  /**
  * A map of container directories which should be replaced by tmpfs mounts, and their corresponding mount options. For example:  &#x60;&#x60;&#x60; { \&quot;/run\&quot;: \&quot;rw,noexec,nosuid,size&#x3D;65536k\&quot; } &#x60;&#x60;&#x60;
  */
  Tmpfs?: {
    [key: string]: string;
  };
  /**
  * UTS namespace to use for the container.
  */
  UTSMode?: string;
  /**
  * Sets the usernamespace mode for the container when usernamespace remapping option is enabled.
  */
  UsernsMode?: string;
  /**
  * Size of &#x60;/dev/shm&#x60; in bytes. If omitted, the system uses 64MB.
  */
  ShmSize?: number;
  /**
  * A list of kernel parameters (sysctls) to set in the container.  This field is omitted if not set.
  */
  Sysctls?: {
    [key: string]: string;
  } | null;
  /**
  * Runtime to use with this container.
  */
  Runtime?: string | null;
  /**
  * Isolation technology of the container. (Windows only)
  */
  Isolation?: HostConfigIsolationEnum;
  /**
  * The list of paths to be masked inside the container (this overrides the default set of paths).
  */
  MaskedPaths?: Array<string>;
  /**
  * The list of paths to be set as read-only inside the container (this overrides the default set of paths).
  */
  ReadonlyPaths?: Array<string>;
}
type HostConfigCgroupnsModeEnum = "private" | "host";
type HostConfigIsolationEnum = "default" | "process" | "hyperv" | "";
//#endregion
//#region lib/types/EndpointIPAMConfig.d.ts
/**
* EndpointIPAMConfig represents an endpoint\'s IPAM configuration.
*/
interface EndpointIPAMConfig {
  IPv4Address?: string;
  IPv6Address?: string;
  LinkLocalIPs?: Array<string>;
}
//#endregion
//#region lib/types/EndpointSettings.d.ts
/**
* Configuration for a network endpoint.
*/
interface EndpointSettings {
  IPAMConfig?: EndpointIPAMConfig | null;
  Links?: Array<string>;
  /**
  * MAC address for the endpoint on this network. The network driver might ignore this parameter.
  */
  MacAddress?: string;
  Aliases?: Array<string>;
  /**
  * DriverOpts is a mapping of driver options and values. These options are passed directly to the driver and are driver specific.
  */
  DriverOpts?: {
    [key: string]: string;
  } | null;
  /**
  * This property determines which endpoint will provide the default gateway for a container. The endpoint with the highest priority will be used. If multiple endpoints have the same priority, endpoints are lexicographically sorted based on their network name, and the one that sorts first is picked.
  */
  GwPriority?: number;
  /**
  * Unique ID of the network.
  */
  NetworkID?: string;
  /**
  * Unique ID for the service endpoint in a Sandbox.
  */
  EndpointID?: string;
  /**
  * Gateway address for this network.
  */
  Gateway?: string;
  /**
  * IPv4 address.
  */
  IPAddress?: string;
  /**
  * Mask length of the IPv4 address.
  */
  IPPrefixLen?: number;
  /**
  * IPv6 gateway address.
  */
  IPv6Gateway?: string;
  /**
  * Global IPv6 address.
  */
  GlobalIPv6Address?: string;
  /**
  * Mask length of the global IPv6 address.
  */
  GlobalIPv6PrefixLen?: number;
  /**
  * List of all DNS names an endpoint has on a specific network. This list is based on the container name, network aliases, container short ID, and hostname.  These DNS names are non-fully qualified but can contain several dots. You can get fully qualified DNS names by appending &#x60;.&lt;network-name&gt;&#x60;. For instance, if container name is &#x60;my.ctr&#x60; and the network is named &#x60;testnet&#x60;, &#x60;DNSNames&#x60; will contain &#x60;my.ctr&#x60; and the FQDN will be &#x60;my.ctr.testnet&#x60;.
  */
  DNSNames?: Array<string>;
}
//#endregion
//#region lib/types/NetworkingConfig.d.ts
/**
* NetworkingConfig represents the container\'s networking configuration for each of its interfaces. It is used for the networking configs specified in the `docker create` and `docker network connect` commands.
*/
interface NetworkingConfig {
  /**
  * A mapping of network name to endpoint configuration for that network. The endpoint configuration can be left empty to connect to that network with no particular endpoint configuration.
  */
  EndpointsConfig?: {
    [key: string]: EndpointSettings;
  };
}
//#endregion
//#region lib/types/ContainerCreateRequest.d.ts
interface ContainerCreateRequest {
  /**
  * The hostname to use for the container, as a valid RFC 1123 hostname.
  */
  Hostname?: string;
  /**
  * The domain name to use for the container.
  */
  Domainname?: string;
  /**
  * Commands run as this user inside the container. If omitted, commands run as the user specified in the image the container was started from.  Can be either user-name or UID, and optional group-name or GID, separated by a colon (&#x60;&lt;user-name|UID&gt;[&lt;:group-name|GID&gt;]&#x60;).
  */
  User?: string;
  /**
  * Whether to attach to &#x60;stdin&#x60;.
  */
  AttachStdin?: boolean;
  /**
  * Whether to attach to &#x60;stdout&#x60;.
  */
  AttachStdout?: boolean;
  /**
  * Whether to attach to &#x60;stderr&#x60;.
  */
  AttachStderr?: boolean;
  /**
  * An object mapping ports to an empty object in the form:  &#x60;{\&quot;&lt;port&gt;/&lt;tcp|udp|sctp&gt;\&quot;: {}}&#x60;
  */
  ExposedPorts?: {
    [key: string]: any;
  } | null;
  /**
  * Attach standard streams to a TTY, including &#x60;stdin&#x60; if it is not closed.
  */
  Tty?: boolean;
  /**
  * Open &#x60;stdin&#x60;
  */
  OpenStdin?: boolean;
  /**
  * Close &#x60;stdin&#x60; after one attached client disconnects
  */
  StdinOnce?: boolean;
  /**
  * A list of environment variables to set inside the container in the form &#x60;[\&quot;VAR&#x3D;value\&quot;, ...]&#x60;. A variable without &#x60;&#x3D;&#x60; is removed from the environment, rather than to have an empty value.
  */
  Env?: Array<string>;
  /**
  * Command to run specified as a string or an array of strings.
  */
  Cmd?: Array<string>;
  Healthcheck?: HealthConfig;
  /**
  * Command is already escaped (Windows only)
  */
  ArgsEscaped?: boolean | null;
  /**
  * The name (or reference) of the image to use when creating the container, or which was used when the container was created.
  */
  Image?: string;
  /**
  * An object mapping mount point paths inside the container to empty objects.
  */
  Volumes?: {
    [key: string]: any;
  };
  /**
  * The working directory for commands to run in.
  */
  WorkingDir?: string;
  /**
  * The entry point for the container as a string or an array of strings.  If the array consists of exactly one empty string (&#x60;[\&quot;\&quot;]&#x60;) then the entry point is reset to system default (i.e., the entry point used by docker when there is no &#x60;ENTRYPOINT&#x60; instruction in the &#x60;Dockerfile&#x60;).
  */
  Entrypoint?: Array<string>;
  /**
  * Disable networking for the container.
  */
  NetworkDisabled?: boolean | null;
  /**
  * MAC address of the container.  Deprecated: this field is deprecated in API v1.44 and up. Use EndpointSettings.MacAddress instead.
  */
  MacAddress?: string | null;
  /**
  * &#x60;ONBUILD&#x60; metadata that were defined in the image\&#39;s &#x60;Dockerfile&#x60;.
  */
  OnBuild?: Array<string> | null;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Signal to stop a container as a string or unsigned integer.
  */
  StopSignal?: string | null;
  /**
  * Timeout to stop a container in seconds.
  */
  StopTimeout?: number | null;
  /**
  * Shell for when &#x60;RUN&#x60;, &#x60;CMD&#x60;, and &#x60;ENTRYPOINT&#x60; uses a shell.
  */
  Shell?: Array<string> | null;
  HostConfig?: HostConfig;
  NetworkingConfig?: NetworkingConfig;
}
//#endregion
//#region lib/types/ContainerCreateResponse.d.ts
/**
* OK response to ContainerCreate operation
*/
interface ContainerCreateResponse {
  /**
  * The ID of the created container
  */
  Id: string;
  /**
  * Warnings encountered when creating the container
  */
  Warnings: Array<string>;
}
//#endregion
//#region lib/types/HealthcheckResult.d.ts
/**
* HealthcheckResult stores information about a single run of a healthcheck probe
*/
interface HealthcheckResult {
  /**
  * Date and time at which this check started in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  Start?: Date;
  /**
  * Date and time at which this check ended in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  End?: string;
  /**
  * ExitCode meanings:  - &#x60;0&#x60; healthy - &#x60;1&#x60; unhealthy - &#x60;2&#x60; reserved (considered unhealthy) - other values: error running probe
  */
  ExitCode?: number;
  /**
  * Output from last check
  */
  Output?: string;
}
//#endregion
//#region lib/types/Health.d.ts
/**
* Health stores information about the container\'s healthcheck results.
*/
interface Health {
  /**
  * Status is one of &#x60;none&#x60;, &#x60;starting&#x60;, &#x60;healthy&#x60; or &#x60;unhealthy&#x60;  - \&quot;none\&quot;      Indicates there is no healthcheck - \&quot;starting\&quot;  Starting indicates that the container is not yet ready - \&quot;healthy\&quot;   Healthy indicates that the container is running correctly - \&quot;unhealthy\&quot; Unhealthy indicates that the container has a problem
  */
  Status?: HealthStatusEnum;
  /**
  * FailingStreak is the number of consecutive failures
  */
  FailingStreak?: number;
  /**
  * Log contains the last few results (oldest first)
  */
  Log?: Array<HealthcheckResult>;
}
type HealthStatusEnum = "none" | "starting" | "healthy" | "unhealthy";
//#endregion
//#region lib/types/ContainerState.d.ts
/**
* ContainerState stores container\'s running state. It\'s part of ContainerJSONBase and will be returned by the \"inspect\" command.
*/
interface ContainerState {
  /**
  * String representation of the container state. Can be one of \&quot;created\&quot;, \&quot;running\&quot;, \&quot;paused\&quot;, \&quot;restarting\&quot;, \&quot;removing\&quot;, \&quot;exited\&quot;, or \&quot;dead\&quot;.
  */
  Status?: ContainerStateStatusEnum;
  /**
  * Whether this container is running.  Note that a running container can be _paused_. The &#x60;Running&#x60; and &#x60;Paused&#x60; booleans are not mutually exclusive:  When pausing a container (on Linux), the freezer cgroup is used to suspend all processes in the container. Freezing the process requires the process to be running. As a result, paused containers are both &#x60;Running&#x60; _and_ &#x60;Paused&#x60;.  Use the &#x60;Status&#x60; field instead to determine if a container\&#39;s state is \&quot;running\&quot;.
  */
  Running?: boolean;
  /**
  * Whether this container is paused.
  */
  Paused?: boolean;
  /**
  * Whether this container is restarting.
  */
  Restarting?: boolean;
  /**
  * Whether a process within this container has been killed because it ran out of memory since the container was last started.
  */
  OOMKilled?: boolean;
  Dead?: boolean;
  /**
  * The process ID of this container
  */
  Pid?: number;
  /**
  * The last exit code of this container
  */
  ExitCode?: number;
  Error?: string;
  /**
  * The time when this container was last started.
  */
  StartedAt?: string;
  /**
  * The time when this container last exited.
  */
  FinishedAt?: string;
  Health?: Health | null;
}
type ContainerStateStatusEnum = "created" | "running" | "paused" | "restarting" | "removing" | "exited" | "dead";
//#endregion
//#region lib/types/DriverData.d.ts
/**
* Information about the storage driver used to store the container\'s and image\'s filesystem.
*/
interface DriverData {
  /**
  * Name of the storage driver.
  */
  Name: string;
  /**
  * Low-level storage metadata, provided as key/value pairs.  This information is driver-specific, and depends on the storage-driver in use, and should be used for informational purposes only.
  */
  Data: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/MountPoint.d.ts
/**
* MountPoint represents a mount point configuration inside the container. This is used for reporting the mountpoints in use by a container.
*/
interface MountPoint {
  /**
  * The mount type:  - &#x60;bind&#x60; a mount of a file or directory from the host into the container. - &#x60;volume&#x60; a docker volume with the given &#x60;Name&#x60;. - &#x60;image&#x60; a docker image - &#x60;tmpfs&#x60; a &#x60;tmpfs&#x60;. - &#x60;npipe&#x60; a named pipe from the host into the container. - &#x60;cluster&#x60; a Swarm cluster volume
  */
  Type?: MountPointTypeEnum;
  /**
  * Name is the name reference to the underlying data defined by &#x60;Source&#x60; e.g., the volume name.
  */
  Name?: string;
  /**
  * Source location of the mount.  For volumes, this contains the storage location of the volume (within &#x60;/var/lib/docker/volumes/&#x60;). For bind-mounts, and &#x60;npipe&#x60;, this contains the source (host) part of the bind-mount. For &#x60;tmpfs&#x60; mount points, this field is empty.
  */
  Source?: string;
  /**
  * Destination is the path relative to the container root (&#x60;/&#x60;) where the &#x60;Source&#x60; is mounted inside the container.
  */
  Destination?: string;
  /**
  * Driver is the volume driver used to create the volume (if it is a volume).
  */
  Driver?: string;
  /**
  * Mode is a comma separated list of options supplied by the user when creating the bind/volume mount.  The default is platform-specific (&#x60;\&quot;z\&quot;&#x60; on Linux, empty on Windows).
  */
  Mode?: string;
  /**
  * Whether the mount is mounted writable (read-write).
  */
  RW?: boolean;
  /**
  * Propagation describes how mounts are propagated from the host into the mount point, and vice-versa. Refer to the [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt) for details. This field is not used on Windows.
  */
  Propagation?: string;
}
type MountPointTypeEnum = "bind" | "volume" | "image" | "tmpfs" | "npipe" | "cluster";
//#endregion
//#region lib/types/NetworkSettings.d.ts
/**
* NetworkSettings exposes the network settings in the API
*/
interface NetworkSettings {
  /**
  * Name of the default bridge interface when dockerd\&#39;s --bridge flag is set.  Deprecated: This field is only set when the daemon is started with the --bridge flag specified.
  */
  Bridge?: string;
  /**
  * SandboxID uniquely represents a container\&#39;s network stack.
  */
  SandboxID?: string;
  /**
  * Indicates if hairpin NAT should be enabled on the virtual interface.  Deprecated: This field is never set and will be removed in a future release.
  */
  HairpinMode?: boolean;
  /**
  * IPv6 unicast address using the link-local prefix.  Deprecated: This field is never set and will be removed in a future release.
  */
  LinkLocalIPv6Address?: string;
  /**
  * Prefix length of the IPv6 unicast address.  Deprecated: This field is never set and will be removed in a future release.
  */
  LinkLocalIPv6PrefixLen?: number;
  /**
  * PortMap describes the mapping of container ports to host ports, using the container\&#39;s port-number and protocol as key in the format &#x60;&lt;port&gt;/&lt;protocol&gt;&#x60;, for example, &#x60;80/udp&#x60;.  If a container\&#39;s port is mapped for multiple protocols, separate entries are added to the mapping table.
  */
  Ports?: {
    [key: string]: Array<PortBinding> | null;
  };
  /**
  * SandboxKey is the full path of the netns handle
  */
  SandboxKey?: string;
  /**
  * Deprecated: This field is never set and will be removed in a future release.
  */
  SecondaryIPAddresses?: Array<Address> | null;
  /**
  * Deprecated: This field is never set and will be removed in a future release.
  */
  SecondaryIPv6Addresses?: Array<Address> | null;
  /**
  * EndpointID uniquely represents a service endpoint in a Sandbox.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  EndpointID?: string;
  /**
  * Gateway address for the default \&quot;bridge\&quot; network.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  Gateway?: string;
  /**
  * Global IPv6 address for the default \&quot;bridge\&quot; network.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  GlobalIPv6Address?: string;
  /**
  * Mask length of the global IPv6 address.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  GlobalIPv6PrefixLen?: number;
  /**
  * IPv4 address for the default \&quot;bridge\&quot; network.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  IPAddress?: string;
  /**
  * Mask length of the IPv4 address.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  IPPrefixLen?: number;
  /**
  * IPv6 gateway address for this network.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  IPv6Gateway?: string;
  /**
  * MAC address for the container on the default \&quot;bridge\&quot; network.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is only propagated when attached to the &gt; default \&quot;bridge\&quot; network. Use the information from the \&quot;bridge\&quot; &gt; network inside the &#x60;Networks&#x60; map instead, which contains the same &gt; information. This field was deprecated in Docker 1.9 and is scheduled &gt; to be removed in Docker 17.12.0
  */
  MacAddress?: string;
  /**
  * Information about all networks that the container is connected to.
  */
  Networks?: {
    [key: string]: EndpointSettings;
  };
}
//#endregion
//#region lib/types/OCIPlatform.d.ts
/**
* Describes the platform which the image in the manifest runs on, as defined in the [OCI Image Index Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-index.md).
*/
interface OCIPlatform {
  /**
  * The CPU architecture, for example &#x60;amd64&#x60; or &#x60;ppc64&#x60;.
  */
  architecture?: string;
  /**
  * The operating system, for example &#x60;linux&#x60; or &#x60;windows&#x60;.
  */
  os?: string;
  /**
  * Optional field specifying the operating system version, for example on Windows &#x60;10.0.19041.1165&#x60;.
  */
  "os.version"?: string;
  /**
  * Optional field specifying an array of strings, each listing a required OS feature (for example on Windows &#x60;win32k&#x60;).
  */
  "os.features"?: Array<string>;
  /**
  * Optional field specifying a variant of the CPU, for example &#x60;v7&#x60; to specify ARMv7 when architecture is &#x60;arm&#x60;.
  */
  variant?: string;
}
//#endregion
//#region lib/types/OCIDescriptor.d.ts
/**
* A descriptor struct containing digest, media type, and size, as defined in the [OCI Content Descriptors Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
*/
interface OCIDescriptor {
  /**
  * The media type of the object this schema refers to.
  */
  mediaType?: string;
  /**
  * The digest of the targeted content.
  */
  digest?: string;
  /**
  * The size in bytes of the blob.
  */
  size?: number;
  /**
  * List of URLs from which this object MAY be downloaded.
  */
  urls?: Array<string> | null;
  /**
  * Arbitrary metadata relating to the targeted content.
  */
  annotations?: {
    [key: string]: string;
  } | null;
  /**
  * Data is an embedding of the targeted content. This is encoded as a base64 string when marshalled to JSON (automatically, by encoding/json). If present, Data can be used directly to avoid fetching the targeted content.
  */
  data?: string | null;
  platform?: OCIPlatform | null;
  /**
  * ArtifactType is the IANA media type of this artifact.
  */
  artifactType?: string | null;
}
//#endregion
//#region lib/types/ContainerInspectResponse.d.ts
interface ContainerInspectResponse {
  /**
  * The ID of this container as a 128-bit (64-character) hexadecimal string (32 bytes).
  */
  Id?: string;
  /**
  * Date and time at which the container was created, formatted in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  Created?: string | null;
  /**
  * The path to the command being run
  */
  Path?: string;
  /**
  * The arguments to the command being run
  */
  Args?: Array<string>;
  State?: ContainerState | null;
  /**
  * The ID (digest) of the image that this container was created from.
  */
  Image?: string;
  /**
  * Location of the &#x60;/etc/resolv.conf&#x60; generated for the container on the host.  This file is managed through the docker daemon, and should not be accessed or modified by other tools.
  */
  ResolvConfPath?: string;
  /**
  * Location of the &#x60;/etc/hostname&#x60; generated for the container on the host.  This file is managed through the docker daemon, and should not be accessed or modified by other tools.
  */
  HostnamePath?: string;
  /**
  * Location of the &#x60;/etc/hosts&#x60; generated for the container on the host.  This file is managed through the docker daemon, and should not be accessed or modified by other tools.
  */
  HostsPath?: string;
  /**
  * Location of the file used to buffer the container\&#39;s logs. Depending on the logging-driver used for the container, this field may be omitted.  This file is managed through the docker daemon, and should not be accessed or modified by other tools.
  */
  LogPath?: string | null;
  /**
  * The name associated with this container.  For historic reasons, the name may be prefixed with a forward-slash (&#x60;/&#x60;).
  */
  Name?: string;
  /**
  * Number of times the container was restarted since it was created, or since daemon was started.
  */
  RestartCount?: number;
  /**
  * The storage-driver used for the container\&#39;s filesystem (graph-driver or snapshotter).
  */
  Driver?: string;
  /**
  * The platform (operating system) for which the container was created.  This field was introduced for the experimental \&quot;LCOW\&quot; (Linux Containers On Windows) features, which has been removed. In most cases, this field is equal to the host\&#39;s operating system (&#x60;linux&#x60; or &#x60;windows&#x60;).
  */
  Platform?: string;
  ImageManifestDescriptor?: OCIDescriptor;
  /**
  * SELinux mount label set for the container.
  */
  MountLabel?: string;
  /**
  * SELinux process label set for the container.
  */
  ProcessLabel?: string;
  /**
  * The AppArmor profile set for the container.
  */
  AppArmorProfile?: string;
  /**
  * IDs of exec instances that are running in the container.
  */
  ExecIDs?: Array<string> | null;
  HostConfig?: HostConfig;
  GraphDriver?: DriverData;
  /**
  * The size of files that have been created or changed by this container.  This field is omitted by default, and only set when size is requested in the API request.
  */
  SizeRw?: number | null;
  /**
  * The total size of all files in the read-only layers from the image that the container uses. These layers can be shared between containers.  This field is omitted by default, and only set when size is requested in the API request.
  */
  SizeRootFs?: number | null;
  /**
  * List of mounts used by the container.
  */
  Mounts?: Array<MountPoint>;
  Config?: ContainerConfig;
  NetworkSettings?: NetworkSettings;
}
//#endregion
//#region lib/types/ContainerMemoryStats.d.ts
/**
* Aggregates all memory stats since container inception on Linux. Windows returns stats for commit and private working set only.
*/
interface ContainerMemoryStats {
  /**
  * Current &#x60;res_counter&#x60; usage for memory.  This field is Linux-specific and omitted for Windows containers.
  */
  usage?: number | null;
  /**
  * Maximum usage ever recorded.  This field is Linux-specific and only supported on cgroups v1. It is omitted when using cgroups v2 and for Windows containers.
  */
  max_usage?: number | null;
  /**
  * All the stats exported via memory.stat. when using cgroups v2.  This field is Linux-specific and omitted for Windows containers.
  */
  stats?: {
    [key: string]: number | null;
  };
  /**
  * Number of times memory usage hits limits.  This field is Linux-specific and only supported on cgroups v1. It is omitted when using cgroups v2 and for Windows containers.
  */
  failcnt?: number | null;
  /**
  * This field is Linux-specific and omitted for Windows containers.
  */
  limit?: number | null;
  /**
  * Committed bytes.  This field is Windows-specific and omitted for Linux containers.
  */
  commitbytes?: number | null;
  /**
  * Peak committed bytes.  This field is Windows-specific and omitted for Linux containers.
  */
  commitpeakbytes?: number | null;
  /**
  * Private working set.  This field is Windows-specific and omitted for Linux containers.
  */
  privateworkingset?: number | null;
}
//#endregion
//#region lib/types/ContainerNetworkStats.d.ts
/**
* Aggregates the network stats of one container
*/
interface ContainerNetworkStats {
  /**
  * Bytes received. Windows and Linux.
  */
  rx_bytes?: number;
  /**
  * Packets received. Windows and Linux.
  */
  rx_packets?: number;
  /**
  * Received errors. Not used on Windows.  This field is Linux-specific and always zero for Windows containers.
  */
  rx_errors?: number;
  /**
  * Incoming packets dropped. Windows and Linux.
  */
  rx_dropped?: number;
  /**
  * Bytes sent. Windows and Linux.
  */
  tx_bytes?: number;
  /**
  * Packets sent. Windows and Linux.
  */
  tx_packets?: number;
  /**
  * Sent errors. Not used on Windows.  This field is Linux-specific and always zero for Windows containers.
  */
  tx_errors?: number;
  /**
  * Outgoing packets dropped. Windows and Linux.
  */
  tx_dropped?: number;
  /**
  * Endpoint ID. Not used on Linux.  This field is Windows-specific and omitted for Linux containers.
  */
  endpoint_id?: string | null;
  /**
  * Instance ID. Not used on Linux.  This field is Windows-specific and omitted for Linux containers.
  */
  instance_id?: string | null;
}
//#endregion
//#region lib/types/ContainerPidsStats.d.ts
/**
* PidsStats contains Linux-specific stats of a container\'s process-IDs (PIDs).  This type is Linux-specific and omitted for Windows containers.
*/
interface ContainerPidsStats {
  /**
  * Current is the number of PIDs in the cgroup.
  */
  current?: number | null;
  /**
  * Limit is the hard limit on the number of pids in the cgroup. A \&quot;Limit\&quot; of 0 means that there is no limit.
  */
  limit?: number | null;
}
//#endregion
//#region lib/types/ContainerPruneResponse.d.ts
interface ContainerPruneResponse {
  /**
  * Container IDs that were deleted
  */
  ContainersDeleted?: Array<string>;
  /**
  * Disk space reclaimed in bytes
  */
  SpaceReclaimed?: number;
}
//#endregion
//#region lib/types/ContainerStorageStats.d.ts
/**
* StorageStats is the disk I/O stats for read/write on Windows.  This type is Windows-specific and omitted for Linux containers.
*/
interface ContainerStorageStats {
  read_count_normalized?: number | null;
  read_size_bytes?: number | null;
  write_count_normalized?: number | null;
  write_size_bytes?: number | null;
}
//#endregion
//#region lib/types/ContainerStatsResponse.d.ts
/**
* Statistics sample for a container.
*/
interface ContainerStatsResponse {
  /**
  * Name of the container
  */
  name?: string | null;
  /**
  * ID of the container
  */
  id?: string | null;
  /**
  * Date and time at which this sample was collected. The value is formatted as [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) with nano-seconds.
  */
  read?: Date;
  /**
  * Date and time at which this first sample was collected. This field is not propagated if the \&quot;one-shot\&quot; option is set. If the \&quot;one-shot\&quot; option is set, this field may be omitted, empty, or set to a default date (&#x60;0001-01-01T00:00:00Z&#x60;).  The value is formatted as [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) with nano-seconds.
  */
  preread?: Date;
  pids_stats?: ContainerPidsStats | null;
  blkio_stats?: ContainerBlkioStats | null;
  /**
  * The number of processors on the system.  This field is Windows-specific and always zero for Linux containers.
  */
  num_procs?: number;
  storage_stats?: ContainerStorageStats | null;
  cpu_stats?: ContainerCPUStats | null;
  precpu_stats?: ContainerCPUStats | null;
  memory_stats?: ContainerMemoryStats;
  /**
  * Network statistics for the container per interface.  This field is omitted if the container has no networking enabled.
  */
  networks?: any | null;
}
//#endregion
//#region lib/types/ContainerStatus.d.ts
/**
* represents the status of a container.
*/
interface ContainerStatus {
  ContainerID?: string;
  PID?: number;
  ExitCode?: number;
}
//#endregion
//#region lib/types/ContainerSummaryHealth.d.ts
/**
* Summary of health status  Added in v1.52, before that version all container summary not include Health. After this attribute introduced, it includes containers with no health checks configured, or containers that are not running with none
*/
interface ContainerSummaryHealth {
  /**
  * the health status of the container
  */
  Status?: ContainerSummaryHealthStatusEnum;
  /**
  * FailingStreak is the number of consecutive failures
  */
  FailingStreak?: number;
}
type ContainerSummaryHealthStatusEnum = "none" | "starting" | "healthy" | "unhealthy";
//#endregion
//#region lib/types/ContainerSummaryHostConfig.d.ts
/**
* Summary of host-specific runtime information of the container. This is a reduced set of information in the container\'s \"HostConfig\" as available in the container \"inspect\" response.
*/
interface ContainerSummaryHostConfig {
  /**
  * Networking mode (&#x60;host&#x60;, &#x60;none&#x60;, &#x60;container:&lt;id&gt;&#x60;) or name of the primary network the container is using.  This field is primarily for backward compatibility. The container can be connected to multiple networks for which information can be found in the &#x60;NetworkSettings.Networks&#x60; field, which enumerates settings per network.
  */
  NetworkMode?: string;
  /**
  * Arbitrary key-value metadata attached to the container.
  */
  Annotations?: {
    [key: string]: string;
  } | null;
}
//#endregion
//#region lib/types/ContainerSummaryNetworkSettings.d.ts
/**
* Summary of the container\'s network settings
*/
interface ContainerSummaryNetworkSettings {
  /**
  * Summary of network-settings for each network the container is attached to.
  */
  Networks?: {
    [key: string]: EndpointSettings;
  };
}
//#endregion
//#region lib/types/PortSummary.d.ts
/**
* Describes a port-mapping between the container and the host.
*/
interface PortSummary {
  /**
  * Host IP address that the container\&#39;s port is mapped to
  */
  IP?: string;
  /**
  * Port on the container
  */
  PrivatePort: number;
  /**
  * Port exposed on the host
  */
  PublicPort?: number;
  Type: PortSummaryTypeEnum;
}
type PortSummaryTypeEnum = "tcp" | "udp" | "sctp";
//#endregion
//#region lib/types/ContainerSummary.d.ts
interface ContainerSummary {
  /**
  * The ID of this container as a 128-bit (64-character) hexadecimal string (32 bytes).
  */
  Id?: string;
  /**
  * The names associated with this container. Most containers have a single name, but when using legacy \&quot;links\&quot;, the container can have multiple names.  For historic reasons, names are prefixed with a forward-slash (&#x60;/&#x60;).
  */
  Names?: Array<string>;
  /**
  * The name or ID of the image used to create the container.  This field shows the image reference as was specified when creating the container, which can be in its canonical form (e.g., &#x60;docker.io/library/ubuntu:latest&#x60; or &#x60;docker.io/library/ubuntu@sha256:72297848456d5d37d1262630108ab308d3e9ec7ed1c3286a32fe09856619a782&#x60;), short form (e.g., &#x60;ubuntu:latest&#x60;)), or the ID(-prefix) of the image (e.g., &#x60;72297848456d&#x60;).  The content of this field can be updated at runtime if the image used to create the container is untagged, in which case the field is updated to contain the the image ID (digest) it was resolved to in its canonical, non-truncated form (e.g., &#x60;sha256:72297848456d5d37d1262630108ab308d3e9ec7ed1c3286a32fe09856619a782&#x60;).
  */
  Image?: string;
  /**
  * The ID (digest) of the image that this container was created from.
  */
  ImageID?: string;
  ImageManifestDescriptor?: OCIDescriptor;
  /**
  * Command to run when starting the container
  */
  Command?: string;
  /**
  * Date and time at which the container was created as a Unix timestamp (number of seconds since EPOCH).
  */
  Created?: number;
  /**
  * Port-mappings for the container.
  */
  Ports?: Array<PortSummary>;
  /**
  * The size of files that have been created or changed by this container.  This field is omitted by default, and only set when size is requested in the API request.
  */
  SizeRw?: number | null;
  /**
  * The total size of all files in the read-only layers from the image that the container uses. These layers can be shared between containers.  This field is omitted by default, and only set when size is requested in the API request.
  */
  SizeRootFs?: number | null;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * The state of this container.
  */
  State?: ContainerSummaryStateEnum;
  /**
  * Additional human-readable status of this container (e.g. &#x60;Exit 0&#x60;)
  */
  Status?: string;
  HostConfig?: ContainerSummaryHostConfig;
  NetworkSettings?: ContainerSummaryNetworkSettings;
  /**
  * List of mounts used by the container.
  */
  Mounts?: Array<MountPoint>;
  Health?: ContainerSummaryHealth;
}
type ContainerSummaryStateEnum = "created" | "running" | "paused" | "restarting" | "exited" | "removing" | "dead";
//#endregion
//#region lib/types/ContainerTopResponse.d.ts
/**
* Container \"top\" response.
*/
interface ContainerTopResponse {
  /**
  * The ps column titles
  */
  Titles?: Array<string>;
  /**
  * Each process running in the container, where each process is an array of values corresponding to the titles.
  */
  Processes?: Array<Array<string>>;
}
//#endregion
//#region lib/types/ContainerUpdateRequest.d.ts
interface ContainerUpdateRequest {
  /**
  * An integer value representing this container\&#39;s relative CPU weight versus other containers.
  */
  CpuShares?: number;
  /**
  * Memory limit in bytes.
  */
  Memory?: number;
  /**
  * Path to &#x60;cgroups&#x60; under which the container\&#39;s &#x60;cgroup&#x60; is created. If the path is not absolute, the path is considered to be relative to the &#x60;cgroups&#x60; path of the init process. Cgroups are created if they do not already exist.
  */
  CgroupParent?: string;
  /**
  * Block IO weight (relative weight).
  */
  BlkioWeight?: number;
  /**
  * Block IO weight (relative device weight) in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Weight\&quot;: weight}] &#x60;&#x60;&#x60;
  */
  BlkioWeightDevice?: Array<ResourcesBlkioWeightDeviceInner>;
  /**
  * Limit read rate (bytes per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadBps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (bytes per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteBps?: Array<ThrottleDevice>;
  /**
  * Limit read rate (IO per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadIOps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (IO per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
  /**
  * The length of a CPU period in microseconds.
  */
  CpuPeriod?: number;
  /**
  * Microseconds of CPU time that the container can get in a CPU period.
  */
  CpuQuota?: number;
  /**
  * The length of a CPU real-time period in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimePeriod?: number;
  /**
  * The length of a CPU real-time runtime in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimeRuntime?: number;
  /**
  * CPUs in which to allow execution (e.g., &#x60;0-3&#x60;, &#x60;0,1&#x60;).
  */
  CpusetCpus?: string;
  /**
  * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only effective on NUMA systems.
  */
  CpusetMems?: string;
  /**
  * A list of devices to add to the container.
  */
  Devices?: Array<DeviceMapping>;
  /**
  * a list of cgroup rules to apply to the container
  */
  DeviceCgroupRules?: Array<string>;
  /**
  * A list of requests for devices to be sent to device drivers.
  */
  DeviceRequests?: Array<DeviceRequest>;
  /**
  * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI runtime in use, this option may be ignored. It is no longer supported by the default (runc) runtime.  This field is omitted when empty.
  */
  KernelMemoryTCP?: number;
  /**
  * Memory soft limit in bytes.
  */
  MemoryReservation?: number;
  /**
  * Total memory limit (memory + swap). Set as &#x60;-1&#x60; to enable unlimited swap.
  */
  MemorySwap?: number;
  /**
  * Tune a container\&#39;s memory swappiness behavior. Accepts an integer between 0 and 100.
  */
  MemorySwappiness?: number;
  /**
  * CPU quota in units of 10&lt;sup&gt;-9&lt;/sup&gt; CPUs.
  */
  NanoCpus?: number;
  /**
  * Disable OOM Killer for the container.
  */
  OomKillDisable?: boolean;
  /**
  * Run an init inside the container that forwards signals and reaps processes. This field is omitted if empty, and the default (as configured on the daemon) is used.
  */
  Init?: boolean | null;
  /**
  * Tune a container\&#39;s PIDs limit. Set &#x60;0&#x60; or &#x60;-1&#x60; for unlimited, or &#x60;null&#x60; to not change.
  */
  PidsLimit?: number | null;
  /**
  * A list of resource limits to set in the container. For example:  &#x60;&#x60;&#x60; {\&quot;Name\&quot;: \&quot;nofile\&quot;, \&quot;Soft\&quot;: 1024, \&quot;Hard\&quot;: 2048} &#x60;&#x60;&#x60;
  */
  Ulimits?: Array<ResourcesUlimitsInner>;
  /**
  * The number of usable CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuCount?: number;
  /**
  * The usable percentage of the available CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuPercent?: number;
  /**
  * Maximum IOps for the container system drive (Windows only)
  */
  IOMaximumIOps?: number;
  /**
  * Maximum IO in bytes per second for the container system drive (Windows only).
  */
  IOMaximumBandwidth?: number;
  RestartPolicy?: RestartPolicy;
}
//#endregion
//#region lib/types/ContainerUpdateResponse.d.ts
/**
* Response for a successful container-update.
*/
interface ContainerUpdateResponse {
  /**
  * Warnings encountered when updating the container.
  */
  Warnings?: Array<string>;
}
//#endregion
//#region lib/types/ContainerWaitExitError.d.ts
/**
* container waiting error, if any
*/
interface ContainerWaitExitError {
  /**
  * Details of an error
  */
  Message?: string;
}
//#endregion
//#region lib/types/ContainerWaitResponse.d.ts
/**
* OK response to ContainerWait operation
*/
interface ContainerWaitResponse {
  /**
  * Exit code of the container
  */
  StatusCode: number;
  Error?: ContainerWaitExitError;
}
//#endregion
//#region lib/types/ContainerdInfoNamespaces.d.ts
/**
* The namespaces that the daemon uses for running containers and plugins in containerd. These namespaces can be configured in the daemon configuration, and are considered to be used exclusively by the daemon, Tampering with the containerd instance may cause unexpected behavior.  As these namespaces are considered to be exclusively accessed by the daemon, it is not recommended to change these values, or to change them to a value that is used by other systems, such as cri-containerd.
*/
interface ContainerdInfoNamespaces {
  /**
  * The default containerd namespace used for containers managed by the daemon.  The default namespace for containers is \&quot;moby\&quot;, but will be suffixed with the &#x60;&lt;uid&gt;.&lt;gid&gt;&#x60; of the remapped &#x60;root&#x60; if user-namespaces are enabled and the containerd image-store is used.
  */
  Containers?: string;
  /**
  * The default containerd namespace used for plugins managed by the daemon.  The default namespace for plugins is \&quot;plugins.moby\&quot;, but will be suffixed with the &#x60;&lt;uid&gt;.&lt;gid&gt;&#x60; of the remapped &#x60;root&#x60; if user-namespaces are enabled and the containerd image-store is used.
  */
  Plugins?: string;
}
//#endregion
//#region lib/types/ContainerdInfo.d.ts
/**
* Information for connecting to the containerd instance that is used by the daemon. This is included for debugging purposes only.
*/
interface ContainerdInfo {
  /**
  * The address of the containerd socket.
  */
  Address?: string;
  Namespaces?: ContainerdInfoNamespaces;
}
//#endregion
//#region lib/types/ErrorDetail.d.ts
interface ErrorDetail {
  code?: number;
  message?: string;
}
//#endregion
//#region lib/types/ProgressDetail.d.ts
interface ProgressDetail {
  current?: number;
  total?: number;
}
//#endregion
//#region lib/types/CreateImageInfo.d.ts
interface CreateImageInfo {
  id?: string;
  errorDetail?: ErrorDetail;
  status?: string;
  progressDetail?: ProgressDetail;
}
//#endregion
//#region lib/types/DeviceInfo.d.ts
/**
* DeviceInfo represents a device that can be used by a container.
*/
interface DeviceInfo {
  /**
  * The origin device driver.
  */
  Source?: string;
  /**
  * The unique identifier for the device within its source driver. For CDI devices, this would be an FQDN like \&quot;vendor.com/gpu&#x3D;0\&quot;.
  */
  ID?: string;
}
//#endregion
//#region lib/types/DistributionInspect.d.ts
/**
* Describes the result obtained from contacting the registry to retrieve image metadata.
*/
interface DistributionInspect {
  Descriptor: OCIDescriptor;
  /**
  * An array containing all platforms supported by the image.
  */
  Platforms: Array<OCIPlatform>;
}
//#endregion
//#region lib/types/EndpointPortConfig.d.ts
interface EndpointPortConfig {
  Name?: string;
  Protocol?: EndpointPortConfigProtocolEnum;
  /**
  * The port inside the container.
  */
  TargetPort?: number;
  /**
  * The port on the swarm hosts.
  */
  PublishedPort?: number;
  /**
  * The mode in which port is published.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  - \&quot;ingress\&quot; makes the target port accessible on every node,   regardless of whether there is a task for the service running on   that node or not. - \&quot;host\&quot; bypasses the routing mesh and publish the port directly on   the swarm node where that service is running.
  */
  PublishMode?: EndpointPortConfigPublishModeEnum;
}
type EndpointPortConfigProtocolEnum = "tcp" | "udp" | "sctp";
type EndpointPortConfigPublishModeEnum = "ingress" | "host";
//#endregion
//#region lib/types/EndpointResource.d.ts
/**
* contains network resources allocated and used for a container in a network.
*/
interface EndpointResource {
  Name?: string;
  EndpointID?: string;
  MacAddress?: string;
  IPv4Address?: string;
  IPv6Address?: string;
}
//#endregion
//#region lib/types/EndpointSpec.d.ts
/**
* Properties that can be configured to access and load balance a service.
*/
interface EndpointSpec {
  /**
  * The mode of resolution to use for internal load balancing between tasks.
  */
  Mode?: EndpointSpecModeEnum;
  /**
  * List of exposed ports that this service is accessible on from the outside. Ports can only be provided if &#x60;vip&#x60; resolution mode is used.
  */
  Ports?: Array<EndpointPortConfig>;
}
type EndpointSpecModeEnum = "vip" | "dnsrr";
//#endregion
//#region lib/types/EngineDescriptionPluginsInner.d.ts
interface EngineDescriptionPluginsInner {
  Type?: string;
  Name?: string;
}
//#endregion
//#region lib/types/EngineDescription.d.ts
/**
* EngineDescription provides information about an engine.
*/
interface EngineDescription {
  EngineVersion?: string;
  Labels?: {
    [key: string]: string;
  };
  Plugins?: Array<EngineDescriptionPluginsInner>;
}
//#endregion
//#region lib/types/ErrorResponse.d.ts
/**
* Represents an error.
*/
interface ErrorResponse {
  /**
  * The error message.
  */
  message: string;
}
//#endregion
//#region lib/types/EventActor.d.ts
/**
* Actor describes something that generates events, like a container, network, or a volume.
*/
interface EventActor {
  /**
  * The ID of the object emitting the event
  */
  ID?: string;
  /**
  * Various key/value attributes of the object, depending on its type.
  */
  Attributes?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/EventMessage.d.ts
/**
* EventMessage represents the information an event contains.
*/
interface EventMessage {
  /**
  * The type of object emitting the event
  */
  Type?: EventMessageTypeEnum;
  /**
  * The type of event
  */
  Action?: string;
  Actor?: EventActor;
  /**
  * Scope of the event. Engine events are &#x60;local&#x60; scope. Cluster (Swarm) events are &#x60;swarm&#x60; scope.
  */
  scope?: EventMessageScopeEnum;
  /**
  * Timestamp of event
  */
  time?: number;
  /**
  * Timestamp of event, with nanosecond accuracy
  */
  timeNano?: number;
}
type EventMessageTypeEnum = "builder" | "config" | "container" | "daemon" | "image" | "network" | "node" | "plugin" | "secret" | "service" | "volume";
type EventMessageScopeEnum = "local" | "swarm";
//#endregion
//#region lib/types/ExecConfig.d.ts
interface ExecConfig {
  /**
  * Attach to &#x60;stdin&#x60; of the exec command.
  */
  AttachStdin?: boolean;
  /**
  * Attach to &#x60;stdout&#x60; of the exec command.
  */
  AttachStdout?: boolean;
  /**
  * Attach to &#x60;stderr&#x60; of the exec command.
  */
  AttachStderr?: boolean;
  /**
  * Initial console size, as an &#x60;[height, width]&#x60; array.
  */
  ConsoleSize?: Array<number> | null;
  /**
  * Override the key sequence for detaching a container. Format is a single character &#x60;[a-Z]&#x60; or &#x60;ctrl-&lt;value&gt;&#x60; where &#x60;&lt;value&gt;&#x60; is one of: &#x60;a-z&#x60;, &#x60;@&#x60;, &#x60;^&#x60;, &#x60;[&#x60;, &#x60;,&#x60; or &#x60;_&#x60;.
  */
  DetachKeys?: string;
  /**
  * Allocate a pseudo-TTY.
  */
  Tty?: boolean;
  /**
  * A list of environment variables in the form &#x60;[\&quot;VAR&#x3D;value\&quot;, ...]&#x60;.
  */
  Env?: Array<string>;
  /**
  * Command to run, as a string or array of strings.
  */
  Cmd?: Array<string>;
  /**
  * Runs the exec process with extended privileges.
  */
  Privileged?: boolean;
  /**
  * The user, and optionally, group to run the exec process inside the container. Format is one of: &#x60;user&#x60;, &#x60;user:group&#x60;, &#x60;uid&#x60;, or &#x60;uid:gid&#x60;.
  */
  User?: string;
  /**
  * The working directory for the exec process inside the container.
  */
  WorkingDir?: string;
}
//#endregion
//#region lib/types/ProcessConfig.d.ts
interface ProcessConfig {
  privileged?: boolean;
  user?: string;
  tty?: boolean;
  entrypoint?: string;
  arguments?: Array<string>;
}
//#endregion
//#region lib/types/ExecInspectResponse.d.ts
interface ExecInspectResponse {
  CanRemove?: boolean;
  DetachKeys?: string;
  ID?: string;
  Running?: boolean;
  ExitCode?: number;
  ProcessConfig?: ProcessConfig;
  OpenStdin?: boolean;
  OpenStderr?: boolean;
  OpenStdout?: boolean;
  ContainerID?: string;
  /**
  * The system process ID for the exec process.
  */
  Pid?: number;
}
//#endregion
//#region lib/types/ExecStartConfig.d.ts
interface ExecStartConfig {
  /**
  * Detach from the command.
  */
  Detach?: boolean;
  /**
  * Allocate a pseudo-TTY.
  */
  Tty?: boolean;
  /**
  * Initial console size, as an &#x60;[height, width]&#x60; array.
  */
  ConsoleSize?: Array<number> | null;
}
//#endregion
//#region lib/types/FilesystemChange.d.ts
/**
* Change in the container\'s filesystem.
*/
interface FilesystemChange {
  /**
  * Path to file or directory that has changed.
  */
  Path: string;
  Kind: ChangeType;
}
//#endregion
//#region lib/types/FirewallInfo.d.ts
/**
* Information about the daemon\'s firewalling configuration.  This field is currently only used on Linux, and omitted on other platforms.
*/
interface FirewallInfo {
  /**
  * The name of the firewall backend driver.
  */
  Driver?: string;
  /**
  * Information about the firewall backend, provided as \&quot;label\&quot; / \&quot;value\&quot; pairs.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: The information returned in this field, including the &gt; formatting of values and labels, should not be considered stable, &gt; and may change without notice.
  */
  Info?: Array<Array<string>>;
}
//#endregion
//#region lib/types/GenericResourcesInnerDiscreteResourceSpec.d.ts
interface GenericResourcesInnerDiscreteResourceSpec {
  Kind?: string;
  Value?: number;
}
//#endregion
//#region lib/types/GenericResourcesInnerNamedResourceSpec.d.ts
interface GenericResourcesInnerNamedResourceSpec {
  Kind?: string;
  Value?: string;
}
//#endregion
//#region lib/types/GenericResourcesInner.d.ts
interface GenericResourcesInner {
  NamedResourceSpec?: GenericResourcesInnerNamedResourceSpec;
  DiscreteResourceSpec?: GenericResourcesInnerDiscreteResourceSpec;
}
//#endregion
//#region lib/types/HistoryResponseItem.d.ts
/**
* individual image layer information in response to ImageHistory operation
*/
interface HistoryResponseItem {
  Id: string;
  Created: number;
  CreatedBy: string;
  Tags: Array<string>;
  Size: number;
  Comment: string;
}
//#endregion
//#region lib/types/IDResponse.d.ts
/**
* Response to an API call that returns just an Id
*/
interface IDResponse {
  /**
  * The id of the newly created object.
  */
  Id: string;
}
//#endregion
//#region lib/types/IPAMConfig.d.ts
interface IPAMConfig {
  Subnet?: string;
  IPRange?: string;
  Gateway?: string;
  AuxiliaryAddresses?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/IPAM.d.ts
interface IPAM {
  /**
  * Name of the IPAM driver to use.
  */
  Driver?: string;
  /**
  * List of IPAM configuration options, specified as a map:  &#x60;&#x60;&#x60; {\&quot;Subnet\&quot;: &lt;CIDR&gt;, \&quot;IPRange\&quot;: &lt;CIDR&gt;, \&quot;Gateway\&quot;: &lt;IP address&gt;, \&quot;AuxAddress\&quot;: &lt;device_name:IP address&gt;} &#x60;&#x60;&#x60;
  */
  Config?: Array<IPAMConfig>;
  /**
  * Driver-specific options, specified as a map.
  */
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/ImageConfig.d.ts
/**
* Configuration of the image. These fields are used as defaults when starting a container from the image.
*/
interface ImageConfig {
  /**
  * The user that commands are run as inside the container.
  */
  User?: string;
  /**
  * An object mapping ports to an empty object in the form:  &#x60;{\&quot;&lt;port&gt;/&lt;tcp|udp|sctp&gt;\&quot;: {}}&#x60;
  */
  ExposedPorts?: {
    [key: string]: any;
  } | null;
  /**
  * A list of environment variables to set inside the container in the form &#x60;[\&quot;VAR&#x3D;value\&quot;, ...]&#x60;. A variable without &#x60;&#x3D;&#x60; is removed from the environment, rather than to have an empty value.
  */
  Env?: Array<string>;
  /**
  * Command to run specified as a string or an array of strings.
  */
  Cmd?: Array<string>;
  Healthcheck?: HealthConfig;
  /**
  * Command is already escaped (Windows only)
  */
  ArgsEscaped?: boolean | null;
  /**
  * An object mapping mount point paths inside the container to empty objects.
  */
  Volumes?: {
    [key: string]: any;
  };
  /**
  * The working directory for commands to run in.
  */
  WorkingDir?: string;
  /**
  * The entry point for the container as a string or an array of strings.  If the array consists of exactly one empty string (&#x60;[\&quot;\&quot;]&#x60;) then the entry point is reset to system default (i.e., the entry point used by docker when there is no &#x60;ENTRYPOINT&#x60; instruction in the &#x60;Dockerfile&#x60;).
  */
  Entrypoint?: Array<string>;
  /**
  * &#x60;ONBUILD&#x60; metadata that were defined in the image\&#39;s &#x60;Dockerfile&#x60;.
  */
  OnBuild?: Array<string> | null;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Signal to stop a container as a string or unsigned integer.
  */
  StopSignal?: string | null;
  /**
  * Shell for when &#x60;RUN&#x60;, &#x60;CMD&#x60;, and &#x60;ENTRYPOINT&#x60; uses a shell.
  */
  Shell?: Array<string> | null;
}
//#endregion
//#region lib/types/ImageDeleteResponseItem.d.ts
interface ImageDeleteResponseItem {
  /**
  * The image ID of an image that was untagged
  */
  Untagged?: string;
  /**
  * The image ID of an image that was deleted
  */
  Deleted?: string;
}
//#endregion
//#region lib/types/ImageID.d.ts
/**
* Image ID or Digest
*/
interface ImageID {
  ID?: string;
}
//#endregion
//#region lib/types/ImageInspectMetadata.d.ts
/**
* Additional metadata of the image in the local cache. This information is local to the daemon, and not part of the image itself.
*/
interface ImageInspectMetadata {
  /**
  * Date and time at which the image was last tagged in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.  This information is only available if the image was tagged locally, and omitted otherwise.
  */
  LastTagTime?: string | null;
}
//#endregion
//#region lib/types/ImageInspectRootFS.d.ts
/**
* Information about the image\'s RootFS, including the layer IDs.
*/
interface ImageInspectRootFS {
  Type: string;
  Layers?: Array<string>;
}
//#endregion
//#region lib/types/ImageManifestSummaryAttestationData.d.ts
/**
* The image data for the attestation manifest. This field is only populated when Kind is \"attestation\".
*/
interface ImageManifestSummaryAttestationData {
  /**
  * The digest of the image manifest that this attestation is for.
  */
  For: string;
}
//#endregion
//#region lib/types/ImageManifestSummaryImageDataSize.d.ts
interface ImageManifestSummaryImageDataSize {
  /**
  * Unpacked is the size (in bytes) of the locally unpacked (uncompressed) image content that\&#39;s directly usable by the containers running this image. It\&#39;s independent of the distributable content - e.g. the image might still have an unpacked data that\&#39;s still used by some container even when the distributable/compressed content is already gone.
  */
  Unpacked: number;
}
//#endregion
//#region lib/types/ImageManifestSummaryImageData.d.ts
/**
* The image data for the image manifest. This field is only populated when Kind is \"image\".
*/
interface ImageManifestSummaryImageData {
  Platform: OCIPlatform | null;
  /**
  * The IDs of the containers that are using this image.
  */
  Containers: Array<string>;
  Size: ImageManifestSummaryImageDataSize;
}
//#endregion
//#region lib/types/ImageManifestSummarySize.d.ts
interface ImageManifestSummarySize {
  /**
  * Total is the total size (in bytes) of all the locally present data (both distributable and non-distributable) that\&#39;s related to this manifest and its children. This equal to the sum of [Content] size AND all the sizes in the [Size] struct present in the Kind-specific data struct. For example, for an image kind (Kind &#x3D;&#x3D; \&quot;image\&quot;) this would include the size of the image content and unpacked image snapshots ([Size.Content] + [ImageData.Size.Unpacked]).
  */
  Total: number;
  /**
  * Content is the size (in bytes) of all the locally present content in the content store (e.g. image config, layers) referenced by this manifest and its children. This only includes blobs in the content store.
  */
  Content: number;
}
//#endregion
//#region lib/types/ImageManifestSummary.d.ts
/**
* ImageManifestSummary represents a summary of an image manifest.
*/
interface ImageManifestSummary {
  /**
  * ID is the content-addressable ID of an image and is the same as the digest of the image manifest.
  */
  ID: string;
  Descriptor: OCIDescriptor;
  /**
  * Indicates whether all the child content (image config, layers) is fully available locally.
  */
  Available: boolean;
  Size: ImageManifestSummarySize;
  /**
  * The kind of the manifest.  kind         | description -------------|----------------------------------------------------------- image        | Image manifest that can be used to start a container. attestation  | Attestation manifest produced by the Buildkit builder for a specific image manifest.
  */
  Kind: ImageManifestSummaryKindEnum;
  ImageData?: ImageManifestSummaryImageData | null;
  AttestationData?: ImageManifestSummaryAttestationData | null;
}
type ImageManifestSummaryKindEnum = "image" | "attestation" | "unknown";
//#endregion
//#region lib/types/ImageInspect.d.ts
/**
* Information about an image in the local image cache.
*/
interface ImageInspect {
  /**
  * ID is the content-addressable ID of an image.  This identifier is a content-addressable digest calculated from the image\&#39;s configuration (which includes the digests of layers used by the image).  Note that this digest differs from the &#x60;RepoDigests&#x60; below, which holds digests of image manifests that reference the image.
  */
  Id?: string;
  Descriptor?: OCIDescriptor;
  /**
  * Manifests is a list of image manifests available in this image. It provides a more detailed view of the platform-specific image manifests or other image-attached data like build attestations.  Only available if the daemon provides a multi-platform image store and the &#x60;manifests&#x60; option is set in the inspect request.  WARNING: This is experimental and may change at any time without any backward compatibility.
  */
  Manifests?: Array<ImageManifestSummary> | null;
  /**
  * List of image names/tags in the local image cache that reference this image.  Multiple image tags can refer to the same image, and this list may be empty if no tags reference the image, in which case the image is \&quot;untagged\&quot;, in which case it can still be referenced by its ID.
  */
  RepoTags?: Array<string>;
  /**
  * List of content-addressable digests of locally available image manifests that the image is referenced from. Multiple manifests can refer to the same image.  These digests are usually only available if the image was either pulled from a registry, or if the image was pushed to a registry, which is when the manifest is generated and its digest calculated.
  */
  RepoDigests?: Array<string>;
  /**
  * ID of the parent image.  Depending on how the image was created, this field may be empty and is only set for images that were built/created locally. This field is empty if the image was pulled from an image registry.
  */
  Parent?: string;
  /**
  * Optional message that was set when committing or importing the image.
  */
  Comment?: string;
  /**
  * Date and time at which the image was created, formatted in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.  This information is only available if present in the image, and omitted otherwise.
  */
  Created?: string | null;
  /**
  * The version of Docker that was used to build the image.  Depending on how the image was created, this field may be empty.
  */
  DockerVersion?: string;
  /**
  * Name of the author that was specified when committing the image, or as specified through MAINTAINER (deprecated) in the Dockerfile.
  */
  Author?: string;
  Config?: ImageConfig;
  /**
  * Hardware CPU architecture that the image runs on.
  */
  Architecture?: string;
  /**
  * CPU architecture variant (presently ARM-only).
  */
  Variant?: string | null;
  /**
  * Operating System the image is built to run on.
  */
  Os?: string;
  /**
  * Operating System version the image is built to run on (especially for Windows).
  */
  OsVersion?: string | null;
  /**
  * Total size of the image including all layers it is composed of.
  */
  Size?: number;
  /**
  * Total size of the image including all layers it is composed of.  Deprecated: this field is omitted in API v1.44, but kept for backward compatibility. Use Size instead.
  */
  VirtualSize?: number;
  GraphDriver?: DriverData;
  RootFS?: ImageInspectRootFS;
  Metadata?: ImageInspectMetadata;
}
//#endregion
//#region lib/types/ImagePruneResponse.d.ts
interface ImagePruneResponse {
  /**
  * Images that were deleted
  */
  ImagesDeleted?: Array<ImageDeleteResponseItem>;
  /**
  * Disk space reclaimed in bytes
  */
  SpaceReclaimed?: number;
}
//#endregion
//#region lib/types/ImageSearchResponseItem.d.ts
interface ImageSearchResponseItem {
  description?: string;
  is_official?: boolean;
  /**
  * Whether this repository has automated builds enabled.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: This field is deprecated and will always be \&quot;false\&quot;.
  */
  is_automated?: boolean;
  name?: string;
  star_count?: number;
}
//#endregion
//#region lib/types/ImageSummary.d.ts
interface ImageSummary {
  /**
  * ID is the content-addressable ID of an image.  This identifier is a content-addressable digest calculated from the image\&#39;s configuration (which includes the digests of layers used by the image).  Note that this digest differs from the &#x60;RepoDigests&#x60; below, which holds digests of image manifests that reference the image.
  */
  Id: string;
  /**
  * ID of the parent image.  Depending on how the image was created, this field may be empty and is only set for images that were built/created locally. This field is empty if the image was pulled from an image registry.
  */
  ParentId: string;
  /**
  * List of image names/tags in the local image cache that reference this image.  Multiple image tags can refer to the same image, and this list may be empty if no tags reference the image, in which case the image is \&quot;untagged\&quot;, in which case it can still be referenced by its ID.
  */
  RepoTags: Array<string>;
  /**
  * List of content-addressable digests of locally available image manifests that the image is referenced from. Multiple manifests can refer to the same image.  These digests are usually only available if the image was either pulled from a registry, or if the image was pushed to a registry, which is when the manifest is generated and its digest calculated.
  */
  RepoDigests: Array<string>;
  /**
  * Date and time at which the image was created as a Unix timestamp (number of seconds since EPOCH).
  */
  Created: number;
  /**
  * Total size of the image including all layers it is composed of.
  */
  Size: number;
  /**
  * Total size of image layers that are shared between this image and other images.  This size is not calculated by default. &#x60;-1&#x60; indicates that the value has not been set / calculated.
  */
  SharedSize: number;
  /**
  * Total size of the image including all layers it is composed of.  Deprecated: this field is omitted in API v1.44, but kept for backward compatibility. Use Size instead.
  */
  VirtualSize?: number;
  /**
  * User-defined key/value metadata.
  */
  Labels: {
    [key: string]: string;
  };
  /**
  * Number of containers using this image. Includes both stopped and running containers.  &#x60;-1&#x60; indicates that the value has not been set / calculated.
  */
  Containers: number;
  /**
  * Manifests is a list of manifests available in this image. It provides a more detailed view of the platform-specific image manifests or other image-attached data like build attestations.  WARNING: This is experimental and may change at any time without any backward compatibility.
  */
  Manifests?: Array<ImageManifestSummary>;
  Descriptor?: OCIDescriptor;
}
//#endregion
//#region lib/types/IndexInfo.d.ts
/**
* IndexInfo contains information about a registry.
*/
interface IndexInfo {
  /**
  * Name of the registry, such as \&quot;docker.io\&quot;.
  */
  Name?: string;
  /**
  * List of mirrors, expressed as URIs.
  */
  Mirrors?: Array<string>;
  /**
  * Indicates if the registry is part of the list of insecure registries.  If &#x60;false&#x60;, the registry is insecure. Insecure registries accept un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from unknown CAs) communication.  &gt; **Warning**: Insecure registries can be useful when running a local &gt; registry. However, because its use creates security vulnerabilities &gt; it should ONLY be enabled for testing purposes. For increased &gt; security, users should add their CA to their system\&#39;s list of &gt; trusted CAs instead of enabling this option.
  */
  Secure?: boolean;
  /**
  * Indicates whether this is an official registry (i.e., Docker Hub / docker.io)
  */
  Official?: boolean;
}
//#endregion
//#region lib/types/JSONMessage.d.ts
interface JSONMessage {
  id?: string;
  stream?: string;
  errorDetail?: ErrorDetail;
  status?: string;
  progressDetail?: ProgressDetail;
  aux?: ImageID;
}
//#endregion
//#region lib/types/JoinTokens.d.ts
/**
* JoinTokens contains the tokens workers and managers need to join the swarm.
*/
interface JoinTokens {
  /**
  * The token workers can use to join the swarm.
  */
  Worker?: string;
  /**
  * The token managers can use to join the swarm.
  */
  Manager?: string;
}
//#endregion
//#region lib/types/Limit.d.ts
/**
* An object describing a limit on resources which can be requested by a task.
*/
interface Limit {
  NanoCPUs?: number;
  MemoryBytes?: number;
  /**
  * Limits the maximum number of PIDs in the container. Set &#x60;0&#x60; for unlimited.
  */
  Pids?: number;
}
//#endregion
//#region lib/types/LocalNodeState.d.ts
/**
* Current local status of this node.
*/
type LocalNodeState = "" | "inactive" | "pending" | "active" | "error" | "locked";
//#endregion
//#region lib/types/Reachability.d.ts
/**
* Reachability represents the reachability of a node.
*/
type Reachability = "unknown" | "unreachable" | "reachable";
//#endregion
//#region lib/types/ManagerStatus.d.ts
/**
* ManagerStatus represents the status of a manager.  It provides the current status of a node\'s manager component, if the node is a manager.
*/
interface ManagerStatus {
  Leader?: boolean;
  Reachability?: Reachability;
  /**
  * The IP address and port at which the manager is reachable.
  */
  Addr?: string;
}
//#endregion
//#region lib/types/PeerInfo.d.ts
/**
* represents one peer of an overlay network.
*/
interface PeerInfo {
  /**
  * ID of the peer-node in the Swarm cluster.
  */
  Name?: string;
  /**
  * IP-address of the peer-node in the Swarm cluster.
  */
  IP?: string;
}
//#endregion
//#region lib/types/Network.d.ts
interface Network {
  /**
  * Name of the network.
  */
  Name?: string;
  /**
  * ID that uniquely identifies a network on a single machine.
  */
  Id?: string;
  /**
  * Date and time at which the network was created in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  Created?: string;
  /**
  * The level at which the network exists (e.g. &#x60;swarm&#x60; for cluster-wide or &#x60;local&#x60; for machine level)
  */
  Scope?: string;
  /**
  * The name of the driver used to create the network (e.g. &#x60;bridge&#x60;, &#x60;overlay&#x60;).
  */
  Driver?: string;
  /**
  * Whether the network was created with IPv4 enabled.
  */
  EnableIPv4?: boolean;
  /**
  * Whether the network was created with IPv6 enabled.
  */
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  /**
  * Whether the network is created to only allow internal networking connectivity.
  */
  Internal?: boolean;
  /**
  * Whether a global / swarm scope network is manually attachable by regular containers from workers in swarm mode.
  */
  Attachable?: boolean;
  /**
  * Whether the network is providing the routing-mesh for the swarm cluster.
  */
  Ingress?: boolean;
  ConfigFrom?: ConfigReference;
  /**
  * Whether the network is a config-only network. Config-only networks are placeholder networks for network configurations to be used by other networks. Config-only networks cannot be used directly to run containers or services.
  */
  ConfigOnly?: boolean;
  /**
  * Network-specific options uses when creating the network.
  */
  Options?: {
    [key: string]: string;
  };
  /**
  * Metadata specific to the network being created.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * List of peer nodes for an overlay network. This field is only present for overlay networks, and omitted for other network types.
  */
  Peers?: Array<PeerInfo>;
}
//#endregion
//#region lib/types/NetworkAttachmentConfig.d.ts
/**
* Specifies how a service should be attached to a particular network.
*/
interface NetworkAttachmentConfig {
  /**
  * The target network for attachment. Must be a network name or ID.
  */
  Target?: string;
  /**
  * Discoverable alternate names for the service on this network.
  */
  Aliases?: Array<string>;
  /**
  * Driver attachment options for the network target.
  */
  DriverOpts?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/NetworkConnectRequest.d.ts
interface NetworkConnectRequest {
  /**
  * The ID or name of the container to connect to the network.
  */
  Container?: string;
  EndpointConfig?: EndpointSettings;
}
//#endregion
//#region lib/types/NetworkCreateRequest.d.ts
interface NetworkCreateRequest {
  /**
  * The network\&#39;s name.
  */
  Name: string;
  /**
  * Name of the network driver plugin to use.
  */
  Driver?: string;
  /**
  * The level at which the network exists (e.g. &#x60;swarm&#x60; for cluster-wide or &#x60;local&#x60; for machine level).
  */
  Scope?: string;
  /**
  * Restrict external access to the network.
  */
  Internal?: boolean;
  /**
  * Globally scoped network is manually attachable by regular containers from workers in swarm mode.
  */
  Attachable?: boolean;
  /**
  * Ingress network is the network which provides the routing-mesh in swarm mode.
  */
  Ingress?: boolean;
  /**
  * Creates a config-only network. Config-only networks are placeholder networks for network configurations to be used by other networks. Config-only networks cannot be used directly to run containers or services.
  */
  ConfigOnly?: boolean;
  ConfigFrom?: ConfigReference;
  IPAM?: IPAM;
  /**
  * Enable IPv4 on the network.
  */
  EnableIPv4?: boolean;
  /**
  * Enable IPv6 on the network.
  */
  EnableIPv6?: boolean;
  /**
  * Network specific options to be used by the drivers.
  */
  Options?: {
    [key: string]: string;
  };
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/NetworkCreateResponse.d.ts
/**
* OK response to NetworkCreate operation
*/
interface NetworkCreateResponse {
  /**
  * The ID of the created network.
  */
  Id: string;
  /**
  * Warnings encountered when creating the container
  */
  Warning: string;
}
//#endregion
//#region lib/types/NetworkDisconnectRequest.d.ts
interface NetworkDisconnectRequest {
  /**
  * The ID or name of the container to disconnect from the network.
  */
  Container?: string;
  /**
  * Force the container to disconnect from the network.
  */
  Force?: boolean;
}
//#endregion
//#region lib/types/NetworkInspect.d.ts
/**
* The body of the \"get network\" http response message.
*/
interface NetworkInspect {
  /**
  * Contains endpoints attached to the network.
  */
  Containers?: {
    [key: string]: EndpointResource;
  };
  /**
  * List of services using the network. This field is only present for swarm scope networks, and omitted for local scope networks.
  */
  Services?: {
    [key: string]: any;
  };
  /**
  * Name of the network.
  */
  Name?: string;
  /**
  * ID that uniquely identifies a network on a single machine.
  */
  Id?: string;
  /**
  * Date and time at which the network was created in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  Created?: string;
  /**
  * The level at which the network exists (e.g. &#x60;swarm&#x60; for cluster-wide or &#x60;local&#x60; for machine level)
  */
  Scope?: string;
  /**
  * The name of the driver used to create the network (e.g. &#x60;bridge&#x60;, &#x60;overlay&#x60;).
  */
  Driver?: string;
  /**
  * Whether the network was created with IPv4 enabled.
  */
  EnableIPv4?: boolean;
  /**
  * Whether the network was created with IPv6 enabled.
  */
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  /**
  * Whether the network is created to only allow internal networking connectivity.
  */
  Internal?: boolean;
  /**
  * Whether a global / swarm scope network is manually attachable by regular containers from workers in swarm mode.
  */
  Attachable?: boolean;
  /**
  * Whether the network is providing the routing-mesh for the swarm cluster.
  */
  Ingress?: boolean;
  ConfigFrom?: ConfigReference;
  /**
  * Whether the network is a config-only network. Config-only networks are placeholder networks for network configurations to be used by other networks. Config-only networks cannot be used directly to run containers or services.
  */
  ConfigOnly?: boolean;
  /**
  * Network-specific options uses when creating the network.
  */
  Options?: {
    [key: string]: string;
  };
  /**
  * Metadata specific to the network being created.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * List of peer nodes for an overlay network. This field is only present for overlay networks, and omitted for other network types.
  */
  Peers?: Array<PeerInfo>;
}
//#endregion
//#region lib/types/NetworkPruneResponse.d.ts
interface NetworkPruneResponse {
  /**
  * Networks that were deleted
  */
  NetworksDeleted?: Array<string>;
}
//#endregion
//#region lib/types/NetworkSummary.d.ts
/**
* Network list response item
*/
interface NetworkSummary {
  /**
  * Name of the network.
  */
  Name?: string;
  /**
  * ID that uniquely identifies a network on a single machine.
  */
  Id?: string;
  /**
  * Date and time at which the network was created in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  Created?: string;
  /**
  * The level at which the network exists (e.g. &#x60;swarm&#x60; for cluster-wide or &#x60;local&#x60; for machine level)
  */
  Scope?: string;
  /**
  * The name of the driver used to create the network (e.g. &#x60;bridge&#x60;, &#x60;overlay&#x60;).
  */
  Driver?: string;
  /**
  * Whether the network was created with IPv4 enabled.
  */
  EnableIPv4?: boolean;
  /**
  * Whether the network was created with IPv6 enabled.
  */
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  /**
  * Whether the network is created to only allow internal networking connectivity.
  */
  Internal?: boolean;
  /**
  * Whether a global / swarm scope network is manually attachable by regular containers from workers in swarm mode.
  */
  Attachable?: boolean;
  /**
  * Whether the network is providing the routing-mesh for the swarm cluster.
  */
  Ingress?: boolean;
  ConfigFrom?: ConfigReference;
  /**
  * Whether the network is a config-only network. Config-only networks are placeholder networks for network configurations to be used by other networks. Config-only networks cannot be used directly to run containers or services.
  */
  ConfigOnly?: boolean;
  /**
  * Network-specific options uses when creating the network.
  */
  Options?: {
    [key: string]: string;
  };
  /**
  * Metadata specific to the network being created.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * List of peer nodes for an overlay network. This field is only present for overlay networks, and omitted for other network types.
  */
  Peers?: Array<PeerInfo>;
}
//#endregion
//#region lib/types/NetworkTaskInfo.d.ts
/**
* carries the information about one backend task
*/
interface NetworkTaskInfo {
  Name?: string;
  EndpointID?: string;
  EndpointIP?: string;
  Info?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/Platform.d.ts
/**
* Platform represents the platform (Arch/OS).
*/
interface Platform {
  /**
  * Architecture represents the hardware architecture (for example, &#x60;x86_64&#x60;).
  */
  Architecture?: string;
  /**
  * OS represents the Operating System (for example, &#x60;linux&#x60; or &#x60;windows&#x60;).
  */
  OS?: string;
}
//#endregion
//#region lib/types/ResourceObject.d.ts
/**
* An object describing the resources which can be advertised by a node and requested by a task.
*/
interface ResourceObject {
  NanoCPUs?: number;
  MemoryBytes?: number;
  /**
  * User-defined resources can be either Integer resources (e.g, &#x60;SSD&#x3D;3&#x60;) or String resources (e.g, &#x60;GPU&#x3D;UUID1&#x60;).
  */
  GenericResources?: Array<GenericResourcesInner>;
}
//#endregion
//#region lib/types/NodeDescription.d.ts
/**
* NodeDescription encapsulates the properties of the Node as reported by the agent.
*/
interface NodeDescription {
  Hostname?: string;
  Platform?: Platform;
  Resources?: ResourceObject;
  Engine?: EngineDescription;
  TLSInfo?: TLSInfo;
}
//#endregion
//#region lib/types/NodeSpec.d.ts
interface NodeSpec {
  /**
  * Name for the node.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Role of the node.
  */
  Role?: NodeSpecRoleEnum;
  /**
  * Availability of the node.
  */
  Availability?: NodeSpecAvailabilityEnum;
}
type NodeSpecRoleEnum = "worker" | "manager";
type NodeSpecAvailabilityEnum = "active" | "pause" | "drain";
//#endregion
//#region lib/types/NodeState.d.ts
/**
* NodeState represents the state of a node.
*/
type NodeState = "unknown" | "down" | "ready" | "disconnected";
//#endregion
//#region lib/types/NodeStatus.d.ts
/**
* NodeStatus represents the status of a node.  It provides the current status of the node, as seen by the manager.
*/
interface NodeStatus {
  State?: NodeState;
  Message?: string;
  /**
  * IP address of the node.
  */
  Addr?: string;
}
//#endregion
//#region lib/types/Node.d.ts
interface Node {
  ID?: string;
  Version?: ObjectVersion;
  /**
  * Date and time at which the node was added to the swarm in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  CreatedAt?: string;
  /**
  * Date and time at which the node was last updated in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  UpdatedAt?: string;
  Spec?: NodeSpec;
  Description?: NodeDescription;
  Status?: NodeStatus;
  ManagerStatus?: ManagerStatus | null;
}
//#endregion
//#region lib/types/PeerNode.d.ts
/**
* Represents a peer-node in the swarm
*/
interface PeerNode {
  /**
  * Unique identifier of for this node in the swarm.
  */
  NodeID?: string;
  /**
  * IP address and ports at which this node can be reached.
  */
  Addr?: string;
}
//#endregion
//#region lib/types/PluginConfigArgs.d.ts
interface PluginConfigArgs {
  Name: string;
  Description: string;
  Settable: Array<string>;
  Value: Array<string>;
}
//#endregion
//#region lib/types/PluginConfigInterface.d.ts
/**
* The interface between Docker and the plugin
*/
interface PluginConfigInterface {
  Types: Array<string>;
  Socket: string;
  /**
  * Protocol to use for clients connecting to the plugin.
  */
  ProtocolScheme?: PluginConfigInterfaceProtocolSchemeEnum;
}
type PluginConfigInterfaceProtocolSchemeEnum = "" | "moby.plugins.http/v1";
//#endregion
//#region lib/types/PluginDevice.d.ts
interface PluginDevice {
  Name: string;
  Description: string;
  Settable: Array<string>;
  Path: string;
}
//#endregion
//#region lib/types/PluginConfigLinux.d.ts
interface PluginConfigLinux {
  Capabilities: Array<string>;
  AllowAllDevices: boolean;
  Devices: Array<PluginDevice>;
}
//#endregion
//#region lib/types/PluginConfigNetwork.d.ts
interface PluginConfigNetwork {
  Type: string;
}
//#endregion
//#region lib/types/PluginConfigRootfs.d.ts
interface PluginConfigRootfs {
  type?: string;
  diff_ids?: Array<string>;
}
//#endregion
//#region lib/types/PluginConfigUser.d.ts
interface PluginConfigUser {
  UID?: number;
  GID?: number;
}
//#endregion
//#region lib/types/PluginEnv.d.ts
interface PluginEnv {
  Name: string;
  Description: string;
  Settable: Array<string>;
  Value: string;
}
//#endregion
//#region lib/types/PluginMount.d.ts
interface PluginMount {
  Name: string;
  Description: string;
  Settable: Array<string>;
  Source: string;
  Destination: string;
  Type: string;
  Options: Array<string>;
}
//#endregion
//#region lib/types/PluginConfig.d.ts
/**
* The config of a plugin.
*/
interface PluginConfig {
  /**
  * Docker Version used to create the plugin
  */
  DockerVersion?: string;
  Description: string;
  Documentation: string;
  Interface: PluginConfigInterface;
  Entrypoint: Array<string>;
  WorkDir: string;
  User?: PluginConfigUser;
  Network: PluginConfigNetwork;
  Linux: PluginConfigLinux;
  PropagatedMount: string;
  IpcHost: boolean;
  PidHost: boolean;
  Mounts: Array<PluginMount>;
  Env: Array<PluginEnv>;
  Args: PluginConfigArgs;
  rootfs?: PluginConfigRootfs;
}
//#endregion
//#region lib/types/PluginSettings.d.ts
/**
* user-configurable settings for the plugin.
*/
interface PluginSettings {
  Mounts: Array<PluginMount>;
  Env: Array<string>;
  Args: Array<string>;
  Devices: Array<PluginDevice>;
}
//#endregion
//#region lib/types/Plugin.d.ts
/**
* A plugin for the Engine API
*/
interface Plugin {
  Id?: string;
  Name: string;
  /**
  * True if the plugin is running. False if the plugin is not running, only installed.
  */
  Enabled: boolean;
  Settings: PluginSettings;
  /**
  * plugin remote reference used to push/pull the plugin
  */
  PluginReference?: string;
  Config: PluginConfig;
}
//#endregion
//#region lib/types/PluginPrivilege.d.ts
/**
* Describes a permission the user has to accept upon installing the plugin.
*/
interface PluginPrivilege {
  Name?: string;
  Description?: string;
  Value?: Array<string>;
}
//#endregion
//#region lib/types/PluginsInfo.d.ts
/**
* Available plugins per type.  <p><br /></p>  > **Note**: Only unmanaged (V1) plugins are included in this list. > V1 plugins are \"lazily\" loaded, and are not returned in this list > if there is no resource using the plugin.
*/
interface PluginsInfo {
  /**
  * Names of available volume-drivers, and network-driver plugins.
  */
  Volume?: Array<string>;
  /**
  * Names of available network-drivers, and network-driver plugins.
  */
  Network?: Array<string>;
  /**
  * Names of available authorization plugins.
  */
  Authorization?: Array<string>;
  /**
  * Names of available logging-drivers, and logging-driver plugins.
  */
  Log?: Array<string>;
}
//#endregion
//#region lib/types/PortStatus.d.ts
/**
* represents the port status of a task\'s host ports whose service has published host ports
*/
interface PortStatus {
  Ports?: Array<EndpointPortConfig>;
}
//#endregion
//#region lib/types/PushImageInfo.d.ts
interface PushImageInfo {
  errorDetail?: ErrorDetail;
  status?: string;
  progressDetail?: ProgressDetail;
}
//#endregion
//#region lib/types/RegistryServiceConfig.d.ts
/**
* RegistryServiceConfig stores daemon registry services configuration.
*/
interface RegistryServiceConfig {
  /**
  * List of IP ranges of insecure registries, using the CIDR syntax ([RFC 4632](https://tools.ietf.org/html/4632)). Insecure registries accept un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from unknown CAs) communication.  By default, local registries (&#x60;::1/128&#x60; and &#x60;127.0.0.0/8&#x60;) are configured as insecure. All other registries are secure. Communicating with an insecure registry is not possible if the daemon assumes that registry is secure.  This configuration override this behavior, insecure communication with registries whose resolved IP address is within the subnet described by the CIDR syntax.  Registries can also be marked insecure by hostname. Those registries are listed under &#x60;IndexConfigs&#x60; and have their &#x60;Secure&#x60; field set to &#x60;false&#x60;.  &gt; **Warning**: Using this option can be useful when running a local &gt; registry, but introduces security vulnerabilities. This option &gt; should therefore ONLY be used for testing purposes. For increased &gt; security, users should add their CA to their system\&#39;s list of trusted &gt; CAs instead of enabling this option.
  */
  InsecureRegistryCIDRs?: Array<string>;
  IndexConfigs?: {
    [key: string]: IndexInfo;
  };
  /**
  * List of registry URLs that act as a mirror for the official (&#x60;docker.io&#x60;) registry.
  */
  Mirrors?: Array<string>;
}
//#endregion
//#region lib/types/Resources.d.ts
/**
* A container\'s resources (cgroups config, ulimits, etc)
*/
interface Resources {
  /**
  * An integer value representing this container\&#39;s relative CPU weight versus other containers.
  */
  CpuShares?: number;
  /**
  * Memory limit in bytes.
  */
  Memory?: number;
  /**
  * Path to &#x60;cgroups&#x60; under which the container\&#39;s &#x60;cgroup&#x60; is created. If the path is not absolute, the path is considered to be relative to the &#x60;cgroups&#x60; path of the init process. Cgroups are created if they do not already exist.
  */
  CgroupParent?: string;
  /**
  * Block IO weight (relative weight).
  */
  BlkioWeight?: number;
  /**
  * Block IO weight (relative device weight) in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Weight\&quot;: weight}] &#x60;&#x60;&#x60;
  */
  BlkioWeightDevice?: Array<ResourcesBlkioWeightDeviceInner>;
  /**
  * Limit read rate (bytes per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadBps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (bytes per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteBps?: Array<ThrottleDevice>;
  /**
  * Limit read rate (IO per second) from a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceReadIOps?: Array<ThrottleDevice>;
  /**
  * Limit write rate (IO per second) to a device, in the form:  &#x60;&#x60;&#x60; [{\&quot;Path\&quot;: \&quot;device_path\&quot;, \&quot;Rate\&quot;: rate}] &#x60;&#x60;&#x60;
  */
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
  /**
  * The length of a CPU period in microseconds.
  */
  CpuPeriod?: number;
  /**
  * Microseconds of CPU time that the container can get in a CPU period.
  */
  CpuQuota?: number;
  /**
  * The length of a CPU real-time period in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimePeriod?: number;
  /**
  * The length of a CPU real-time runtime in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
  */
  CpuRealtimeRuntime?: number;
  /**
  * CPUs in which to allow execution (e.g., &#x60;0-3&#x60;, &#x60;0,1&#x60;).
  */
  CpusetCpus?: string;
  /**
  * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only effective on NUMA systems.
  */
  CpusetMems?: string;
  /**
  * A list of devices to add to the container.
  */
  Devices?: Array<DeviceMapping>;
  /**
  * a list of cgroup rules to apply to the container
  */
  DeviceCgroupRules?: Array<string>;
  /**
  * A list of requests for devices to be sent to device drivers.
  */
  DeviceRequests?: Array<DeviceRequest>;
  /**
  * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI runtime in use, this option may be ignored. It is no longer supported by the default (runc) runtime.  This field is omitted when empty.
  */
  KernelMemoryTCP?: number;
  /**
  * Memory soft limit in bytes.
  */
  MemoryReservation?: number;
  /**
  * Total memory limit (memory + swap). Set as &#x60;-1&#x60; to enable unlimited swap.
  */
  MemorySwap?: number;
  /**
  * Tune a container\&#39;s memory swappiness behavior. Accepts an integer between 0 and 100.
  */
  MemorySwappiness?: number;
  /**
  * CPU quota in units of 10&lt;sup&gt;-9&lt;/sup&gt; CPUs.
  */
  NanoCpus?: number;
  /**
  * Disable OOM Killer for the container.
  */
  OomKillDisable?: boolean;
  /**
  * Run an init inside the container that forwards signals and reaps processes. This field is omitted if empty, and the default (as configured on the daemon) is used.
  */
  Init?: boolean | null;
  /**
  * Tune a container\&#39;s PIDs limit. Set &#x60;0&#x60; or &#x60;-1&#x60; for unlimited, or &#x60;null&#x60; to not change.
  */
  PidsLimit?: number | null;
  /**
  * A list of resource limits to set in the container. For example:  &#x60;&#x60;&#x60; {\&quot;Name\&quot;: \&quot;nofile\&quot;, \&quot;Soft\&quot;: 1024, \&quot;Hard\&quot;: 2048} &#x60;&#x60;&#x60;
  */
  Ulimits?: Array<ResourcesUlimitsInner>;
  /**
  * The number of usable CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuCount?: number;
  /**
  * The usable percentage of the available CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is &#x60;CPUCount&#x60; first, then &#x60;CPUShares&#x60;, and &#x60;CPUPercent&#x60; last.
  */
  CpuPercent?: number;
  /**
  * Maximum IOps for the container system drive (Windows only)
  */
  IOMaximumIOps?: number;
  /**
  * Maximum IO in bytes per second for the container system drive (Windows only).
  */
  IOMaximumBandwidth?: number;
}
//#endregion
//#region lib/types/Runtime.d.ts
/**
* Runtime describes an [OCI compliant](https://github.com/opencontainers/runtime-spec) runtime.  The runtime is invoked by the daemon via the `containerd` daemon. OCI runtimes act as an interface to the Linux kernel namespaces, cgroups, and SELinux.
*/
interface Runtime {
  /**
  * Name and, optional, path, of the OCI executable binary.  If the path is omitted, the daemon searches the host\&#39;s &#x60;$PATH&#x60; for the binary and uses the first result.
  */
  path?: string;
  /**
  * List of command-line arguments to pass to the runtime when invoked.
  */
  runtimeArgs?: Array<string> | null;
  /**
  * Information specific to the runtime.  While this API specification does not define data provided by runtimes, the following well-known properties may be provided by runtimes:  &#x60;org.opencontainers.runtime-spec.features&#x60;: features structure as defined in the [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec/blob/main/features.md), in a JSON string representation.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: The information returned in this field, including the &gt; formatting of values and labels, should not be considered stable, &gt; and may change without notice.
  */
  status?: {
    [key: string]: string;
  } | null;
}
//#endregion
//#region lib/types/SecretSpec.d.ts
interface SecretSpec {
  /**
  * User-defined name of the secret.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Data is the data to store as a secret, formatted as a Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)) string. It must be empty if the Driver field is set, in which case the data is loaded from an external secret store. The maximum allowed size is 500KB, as defined in [MaxSecretSize](https://pkg.go.dev/github.com/moby/swarmkit/v2@v2.0.0/api/validation#MaxSecretSize).  This field is only used to _create_ a secret, and is not returned by other endpoints.
  */
  Data?: string;
  Driver?: Driver;
  Templating?: Driver;
}
//#endregion
//#region lib/types/Secret.d.ts
interface Secret {
  ID?: string;
  Version?: ObjectVersion;
  CreatedAt?: string;
  UpdatedAt?: string;
  Spec?: SecretSpec;
}
//#endregion
//#region lib/types/SecretCreateRequest.d.ts
interface SecretCreateRequest {
  /**
  * User-defined name of the secret.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * Data is the data to store as a secret, formatted as a Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)) string. It must be empty if the Driver field is set, in which case the data is loaded from an external secret store. The maximum allowed size is 500KB, as defined in [MaxSecretSize](https://pkg.go.dev/github.com/moby/swarmkit/v2@v2.0.0/api/validation#MaxSecretSize).  This field is only used to _create_ a secret, and is not returned by other endpoints.
  */
  Data?: string;
  Driver?: Driver;
  Templating?: Driver;
}
//#endregion
//#region lib/types/ServiceEndpointVirtualIPsInner.d.ts
interface ServiceEndpointVirtualIPsInner {
  NetworkID?: string;
  Addr?: string;
}
//#endregion
//#region lib/types/ServiceEndpoint.d.ts
interface ServiceEndpoint {
  Spec?: EndpointSpec;
  Ports?: Array<EndpointPortConfig>;
  VirtualIPs?: Array<ServiceEndpointVirtualIPsInner>;
}
//#endregion
//#region lib/types/ServiceJobStatus.d.ts
/**
* The status of the service when it is in one of ReplicatedJob or GlobalJob modes. Absent on Replicated and Global mode services. The JobIteration is an ObjectVersion, but unlike the Service\'s version, does not need to be sent with an update request.
*/
interface ServiceJobStatus {
  JobIteration?: ObjectVersion;
  /**
  * The last time, as observed by the server, that this job was started.
  */
  LastExecution?: string;
}
//#endregion
//#region lib/types/ServiceServiceStatus.d.ts
/**
* The status of the service\'s tasks. Provided only when requested as part of a ServiceList operation.
*/
interface ServiceServiceStatus {
  /**
  * The number of tasks for the service currently in the Running state.
  */
  RunningTasks?: number;
  /**
  * The number of tasks for the service desired to be running. For replicated services, this is the replica count from the service spec. For global services, this is computed by taking count of all tasks for the service with a Desired State other than Shutdown.
  */
  DesiredTasks?: number;
  /**
  * The number of tasks for a job that are in the Completed state. This field must be cross-referenced with the service type, as the value of 0 may mean the service is not in a job mode, or it may mean the job-mode service has no tasks yet Completed.
  */
  CompletedTasks?: number;
}
//#endregion
//#region lib/types/ServiceSpecModeReplicated.d.ts
interface ServiceSpecModeReplicated {
  Replicas?: number;
}
//#endregion
//#region lib/types/ServiceSpecModeReplicatedJob.d.ts
/**
* The mode used for services with a finite number of tasks that run to a completed state.
*/
interface ServiceSpecModeReplicatedJob {
  /**
  * The maximum number of replicas to run simultaneously.
  */
  MaxConcurrent?: number;
  /**
  * The total number of replicas desired to reach the Completed state. If unset, will default to the value of &#x60;MaxConcurrent&#x60;
  */
  TotalCompletions?: number;
}
//#endregion
//#region lib/types/ServiceSpecMode.d.ts
/**
* Scheduling mode for the service.
*/
interface ServiceSpecMode {
  Replicated?: ServiceSpecModeReplicated;
  Global?: any;
  ReplicatedJob?: ServiceSpecModeReplicatedJob;
  /**
  * The mode used for services which run a task to the completed state on each valid node.
  */
  GlobalJob?: any;
}
//#endregion
//#region lib/types/ServiceSpecRollbackConfig.d.ts
/**
* Specification for the rollback strategy of the service.
*/
interface ServiceSpecRollbackConfig {
  /**
  * Maximum number of tasks to be rolled back in one iteration (0 means unlimited parallelism).
  */
  Parallelism?: number;
  /**
  * Amount of time between rollback iterations, in nanoseconds.
  */
  Delay?: number;
  /**
  * Action to take if an rolled back task fails to run, or stops running during the rollback.
  */
  FailureAction?: ServiceSpecRollbackConfigFailureActionEnum;
  /**
  * Amount of time to monitor each rolled back task for failures, in nanoseconds.
  */
  Monitor?: number;
  /**
  * The fraction of tasks that may fail during a rollback before the failure action is invoked, specified as a floating point number between 0 and 1.
  */
  MaxFailureRatio?: number;
  /**
  * The order of operations when rolling back a task. Either the old task is shut down before the new task is started, or the new task is started before the old task is shut down.
  */
  Order?: ServiceSpecRollbackConfigOrderEnum;
}
type ServiceSpecRollbackConfigFailureActionEnum = "continue" | "pause";
type ServiceSpecRollbackConfigOrderEnum = "stop-first" | "start-first";
//#endregion
//#region lib/types/ServiceSpecUpdateConfig.d.ts
/**
* Specification for the update strategy of the service.
*/
interface ServiceSpecUpdateConfig {
  /**
  * Maximum number of tasks to be updated in one iteration (0 means unlimited parallelism).
  */
  Parallelism?: number;
  /**
  * Amount of time between updates, in nanoseconds.
  */
  Delay?: number;
  /**
  * Action to take if an updated task fails to run, or stops running during the update.
  */
  FailureAction?: ServiceSpecUpdateConfigFailureActionEnum;
  /**
  * Amount of time to monitor each updated task for failures, in nanoseconds.
  */
  Monitor?: number;
  /**
  * The fraction of tasks that may fail during an update before the failure action is invoked, specified as a floating point number between 0 and 1.
  */
  MaxFailureRatio?: number;
  /**
  * The order of operations when rolling out an updated task. Either the old task is shut down before the new task is started, or the new task is started before the old task is shut down.
  */
  Order?: ServiceSpecUpdateConfigOrderEnum;
}
type ServiceSpecUpdateConfigFailureActionEnum = "continue" | "pause" | "rollback";
type ServiceSpecUpdateConfigOrderEnum = "stop-first" | "start-first";
//#endregion
//#region lib/types/TaskSpecContainerSpecConfigsInnerFile.d.ts
/**
* File represents a specific target that is backed by a file.  <p><br /><p>  > **Note**: `Configs.File` and `Configs.Runtime` are mutually exclusive
*/
interface TaskSpecContainerSpecConfigsInnerFile {
  /**
  * Name represents the final filename in the filesystem.
  */
  Name?: string;
  /**
  * UID represents the file UID.
  */
  UID?: string;
  /**
  * GID represents the file GID.
  */
  GID?: string;
  /**
  * Mode represents the FileMode of the file.
  */
  Mode?: number;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecConfigsInner.d.ts
interface TaskSpecContainerSpecConfigsInner {
  File?: TaskSpecContainerSpecConfigsInnerFile;
  /**
  * Runtime represents a target that is not mounted into the container but is used by the task  &lt;p&gt;&lt;br /&gt;&lt;p&gt;  &gt; **Note**: &#x60;Configs.File&#x60; and &#x60;Configs.Runtime&#x60; are mutually &gt; exclusive
  */
  Runtime?: any;
  /**
  * ConfigID represents the ID of the specific config that we\&#39;re referencing.
  */
  ConfigID?: string;
  /**
  * ConfigName is the name of the config that this references, but this is just provided for lookup/display purposes. The config in the reference will be identified by its ID.
  */
  ConfigName?: string;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecDNSConfig.d.ts
/**
* Specification for DNS related configurations in resolver configuration file (`resolv.conf`).
*/
interface TaskSpecContainerSpecDNSConfig {
  /**
  * The IP addresses of the name servers.
  */
  Nameservers?: Array<string>;
  /**
  * A search list for host-name lookup.
  */
  Search?: Array<string>;
  /**
  * A list of internal resolver variables to be modified (e.g., &#x60;debug&#x60;, &#x60;ndots:3&#x60;, etc.).
  */
  Options?: Array<string>;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecPrivilegesAppArmor.d.ts
/**
* Options for configuring AppArmor on the container
*/
interface TaskSpecContainerSpecPrivilegesAppArmor {
  Mode?: TaskSpecContainerSpecPrivilegesAppArmorModeEnum;
}
type TaskSpecContainerSpecPrivilegesAppArmorModeEnum = "default" | "disabled";
//#endregion
//#region lib/types/TaskSpecContainerSpecPrivilegesCredentialSpec.d.ts
/**
* CredentialSpec for managed service account (Windows only)
*/
interface TaskSpecContainerSpecPrivilegesCredentialSpec {
  /**
  * Load credential spec from a Swarm Config with the given ID. The specified config must also be present in the Configs field with the Runtime property set.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;   &gt; **Note**: &#x60;CredentialSpec.File&#x60;, &#x60;CredentialSpec.Registry&#x60;, &gt; and &#x60;CredentialSpec.Config&#x60; are mutually exclusive.
  */
  Config?: string;
  /**
  * Load credential spec from this file. The file is read by the daemon, and must be present in the &#x60;CredentialSpecs&#x60; subdirectory in the docker data directory, which defaults to &#x60;C:\\ProgramData\\Docker\\&#x60; on Windows.  For example, specifying &#x60;spec.json&#x60; loads &#x60;C:\\ProgramData\\Docker\\CredentialSpecs\\spec.json&#x60;.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: &#x60;CredentialSpec.File&#x60;, &#x60;CredentialSpec.Registry&#x60;, &gt; and &#x60;CredentialSpec.Config&#x60; are mutually exclusive.
  */
  File?: string;
  /**
  * Load credential spec from this value in the Windows registry. The specified registry value must be located in:  &#x60;HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Virtualization\\Containers\\CredentialSpecs&#x60;  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;   &gt; **Note**: &#x60;CredentialSpec.File&#x60;, &#x60;CredentialSpec.Registry&#x60;, &gt; and &#x60;CredentialSpec.Config&#x60; are mutually exclusive.
  */
  Registry?: string;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecPrivilegesSELinuxContext.d.ts
/**
* SELinux labels of the container
*/
interface TaskSpecContainerSpecPrivilegesSELinuxContext {
  /**
  * Disable SELinux
  */
  Disable?: boolean;
  /**
  * SELinux user label
  */
  User?: string;
  /**
  * SELinux role label
  */
  Role?: string;
  /**
  * SELinux type label
  */
  Type?: string;
  /**
  * SELinux level label
  */
  Level?: string;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecPrivilegesSeccomp.d.ts
/**
* Options for configuring seccomp on the container
*/
interface TaskSpecContainerSpecPrivilegesSeccomp {
  Mode?: TaskSpecContainerSpecPrivilegesSeccompModeEnum;
  /**
  * The custom seccomp profile as a json object
  */
  Profile?: string;
}
type TaskSpecContainerSpecPrivilegesSeccompModeEnum = "default" | "unconfined" | "custom";
//#endregion
//#region lib/types/TaskSpecContainerSpecPrivileges.d.ts
/**
* Security options for the container
*/
interface TaskSpecContainerSpecPrivileges {
  CredentialSpec?: TaskSpecContainerSpecPrivilegesCredentialSpec;
  SELinuxContext?: TaskSpecContainerSpecPrivilegesSELinuxContext;
  Seccomp?: TaskSpecContainerSpecPrivilegesSeccomp;
  AppArmor?: TaskSpecContainerSpecPrivilegesAppArmor;
  /**
  * Configuration of the no_new_privs bit in the container
  */
  NoNewPrivileges?: boolean;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecSecretsInnerFile.d.ts
/**
* File represents a specific target that is backed by a file.
*/
interface TaskSpecContainerSpecSecretsInnerFile {
  /**
  * Name represents the final filename in the filesystem.
  */
  Name?: string;
  /**
  * UID represents the file UID.
  */
  UID?: string;
  /**
  * GID represents the file GID.
  */
  GID?: string;
  /**
  * Mode represents the FileMode of the file.
  */
  Mode?: number;
}
//#endregion
//#region lib/types/TaskSpecContainerSpecSecretsInner.d.ts
interface TaskSpecContainerSpecSecretsInner {
  File?: TaskSpecContainerSpecSecretsInnerFile;
  /**
  * SecretID represents the ID of the specific secret that we\&#39;re referencing.
  */
  SecretID?: string;
  /**
  * SecretName is the name of the secret that this references, but this is just provided for lookup/display purposes. The secret in the reference will be identified by its ID.
  */
  SecretName?: string;
}
//#endregion
//#region lib/types/TaskSpecContainerSpec.d.ts
/**
* Container spec for the service.  <p><br /></p>  > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are > mutually exclusive. PluginSpec is only used when the Runtime field > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime > field is set to `attachment`.
*/
interface TaskSpecContainerSpec {
  /**
  * The image name to use for the container
  */
  Image?: string;
  /**
  * User-defined key/value data.
  */
  Labels?: {
    [key: string]: string;
  };
  /**
  * The command to be run in the image.
  */
  Command?: Array<string>;
  /**
  * Arguments to the command.
  */
  Args?: Array<string>;
  /**
  * The hostname to use for the container, as a valid [RFC 1123](https://tools.ietf.org/html/rfc1123) hostname.
  */
  Hostname?: string;
  /**
  * A list of environment variables in the form &#x60;VAR&#x3D;value&#x60;.
  */
  Env?: Array<string>;
  /**
  * The working directory for commands to run in.
  */
  Dir?: string;
  /**
  * The user inside the container.
  */
  User?: string;
  /**
  * A list of additional groups that the container process will run as.
  */
  Groups?: Array<string>;
  Privileges?: TaskSpecContainerSpecPrivileges;
  /**
  * Whether a pseudo-TTY should be allocated.
  */
  TTY?: boolean;
  /**
  * Open &#x60;stdin&#x60;
  */
  OpenStdin?: boolean;
  /**
  * Mount the container\&#39;s root filesystem as read only.
  */
  ReadOnly?: boolean;
  /**
  * Specification for mounts to be added to containers created as part of the service.
  */
  Mounts?: Array<Mount>;
  /**
  * Signal to stop the container.
  */
  StopSignal?: string;
  /**
  * Amount of time to wait for the container to terminate before forcefully killing it.
  */
  StopGracePeriod?: number;
  HealthCheck?: HealthConfig;
  /**
  * A list of hostname/IP mappings to add to the container\&#39;s &#x60;hosts&#x60; file. The format of extra hosts is specified in the [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html) man page:      IP_address canonical_hostname [aliases...]
  */
  Hosts?: Array<string>;
  DNSConfig?: TaskSpecContainerSpecDNSConfig;
  /**
  * Secrets contains references to zero or more secrets that will be exposed to the service.
  */
  Secrets?: Array<TaskSpecContainerSpecSecretsInner>;
  /**
  * An integer value containing the score given to the container in order to tune OOM killer preferences.
  */
  OomScoreAdj?: number;
  /**
  * Configs contains references to zero or more configs that will be exposed to the service.
  */
  Configs?: Array<TaskSpecContainerSpecConfigsInner>;
  /**
  * Isolation technology of the containers running the service. (Windows only)
  */
  Isolation?: TaskSpecContainerSpecIsolationEnum;
  /**
  * Run an init inside the container that forwards signals and reaps processes. This field is omitted if empty, and the default (as configured on the daemon) is used.
  */
  Init?: boolean | null;
  /**
  * Set kernel namedspaced parameters (sysctls) in the container. The Sysctls option on services accepts the same sysctls as the are supported on containers. Note that while the same sysctls are supported, no guarantees or checks are made about their suitability for a clustered environment, and it\&#39;s up to the user to determine whether a given sysctl will work properly in a Service.
  */
  Sysctls?: {
    [key: string]: string;
  };
  /**
  * A list of kernel capabilities to add to the default set for the container.
  */
  CapabilityAdd?: Array<string>;
  /**
  * A list of kernel capabilities to drop from the default set for the container.
  */
  CapabilityDrop?: Array<string>;
  /**
  * A list of resource limits to set in the container. For example: &#x60;{\&quot;Name\&quot;: \&quot;nofile\&quot;, \&quot;Soft\&quot;: 1024, \&quot;Hard\&quot;: 2048}&#x60;\&quot;
  */
  Ulimits?: Array<ResourcesUlimitsInner>;
}
type TaskSpecContainerSpecIsolationEnum = "default" | "process" | "hyperv" | "";
//#endregion
//#region lib/types/TaskSpecLogDriver.d.ts
/**
* Specifies the log driver to use for tasks created from this spec. If not present, the default one for the swarm will be used, finally falling back to the engine default if not specified.
*/
interface TaskSpecLogDriver {
  Name?: string;
  Options?: {
    [key: string]: string;
  };
}
//#endregion
//#region lib/types/TaskSpecNetworkAttachmentSpec.d.ts
/**
* Read-only spec type for non-swarm containers attached to swarm overlay networks.  <p><br /></p>  > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are > mutually exclusive. PluginSpec is only used when the Runtime field > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime > field is set to `attachment`.
*/
interface TaskSpecNetworkAttachmentSpec {
  /**
  * ID of the container represented by this task
  */
  ContainerID?: string;
}
//#endregion
//#region lib/types/TaskSpecPlacementPreferencesInnerSpread.d.ts
interface TaskSpecPlacementPreferencesInnerSpread {
  /**
  * label descriptor, such as &#x60;engine.labels.az&#x60;.
  */
  SpreadDescriptor?: string;
}
//#endregion
//#region lib/types/TaskSpecPlacementPreferencesInner.d.ts
interface TaskSpecPlacementPreferencesInner {
  Spread?: TaskSpecPlacementPreferencesInnerSpread;
}
//#endregion
//#region lib/types/TaskSpecPlacement.d.ts
interface TaskSpecPlacement {
  /**
  * An array of constraint expressions to limit the set of nodes where a task can be scheduled. Constraint expressions can either use a _match_ (&#x60;&#x3D;&#x3D;&#x60;) or _exclude_ (&#x60;!&#x3D;&#x60;) rule. Multiple constraints find nodes that satisfy every expression (AND match). Constraints can match node or Docker Engine labels as follows:  node attribute       | matches                        | example ---------------------|--------------------------------|----------------------------------------------- &#x60;node.id&#x60;            | Node ID                        | &#x60;node.id&#x3D;&#x3D;2ivku8v2gvtg4&#x60; &#x60;node.hostname&#x60;      | Node hostname                  | &#x60;node.hostname!&#x3D;node-2&#x60; &#x60;node.role&#x60;          | Node role (&#x60;manager&#x60;/&#x60;worker&#x60;) | &#x60;node.role&#x3D;&#x3D;manager&#x60; &#x60;node.platform.os&#x60;   | Node operating system          | &#x60;node.platform.os&#x3D;&#x3D;windows&#x60; &#x60;node.platform.arch&#x60; | Node architecture              | &#x60;node.platform.arch&#x3D;&#x3D;x86_64&#x60; &#x60;node.labels&#x60;        | User-defined node labels       | &#x60;node.labels.security&#x3D;&#x3D;high&#x60; &#x60;engine.labels&#x60;      | Docker Engine\&#39;s labels         | &#x60;engine.labels.operatingsystem&#x3D;&#x3D;ubuntu-24.04&#x60;  &#x60;engine.labels&#x60; apply to Docker Engine labels like operating system, drivers, etc. Swarm administrators add &#x60;node.labels&#x60; for operational purposes by using the [&#x60;node update endpoint&#x60;](#operation/NodeUpdate).
  */
  Constraints?: Array<string>;
  /**
  * Preferences provide a way to make the scheduler aware of factors such as topology. They are provided in order from highest to lowest precedence.
  */
  Preferences?: Array<TaskSpecPlacementPreferencesInner>;
  /**
  * Maximum number of replicas for per node (default value is 0, which is unlimited)
  */
  MaxReplicas?: number;
  /**
  * Platforms stores all the platforms that the service\&#39;s image can run on. This field is used in the platform filter for scheduling. If empty, then the platform filter is off, meaning there are no scheduling restrictions.
  */
  Platforms?: Array<Platform>;
}
//#endregion
//#region lib/types/TaskSpecPluginSpec.d.ts
/**
* Plugin spec for the service.  *(Experimental release only.)*  <p><br /></p>  > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are > mutually exclusive. PluginSpec is only used when the Runtime field > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime > field is set to `attachment`.
*/
interface TaskSpecPluginSpec {
  /**
  * The name or \&#39;alias\&#39; to use for the plugin.
  */
  Name?: string;
  /**
  * The plugin image reference to use.
  */
  Remote?: string;
  /**
  * Disable the plugin once scheduled.
  */
  Disabled?: boolean;
  PluginPrivilege?: Array<PluginPrivilege>;
}
//#endregion
//#region lib/types/TaskSpecResources.d.ts
/**
* Resource requirements which apply to each individual container created as part of the service.
*/
interface TaskSpecResources {
  Limits?: Limit;
  Reservations?: ResourceObject;
}
//#endregion
//#region lib/types/TaskSpecRestartPolicy.d.ts
/**
* Specification for the restart policy which applies to containers created as part of this service.
*/
interface TaskSpecRestartPolicy {
  /**
  * Condition for restart.
  */
  Condition?: TaskSpecRestartPolicyConditionEnum;
  /**
  * Delay between restart attempts.
  */
  Delay?: number;
  /**
  * Maximum attempts to restart a given container before giving up (default value is 0, which is ignored).
  */
  MaxAttempts?: number;
  /**
  * Windows is the time window used to evaluate the restart policy (default value is 0, which is unbounded).
  */
  Window?: number;
}
type TaskSpecRestartPolicyConditionEnum = "none" | "on-failure" | "any";
//#endregion
//#region lib/types/TaskSpec.d.ts
/**
* User modifiable task configuration.
*/
interface TaskSpec {
  PluginSpec?: TaskSpecPluginSpec;
  ContainerSpec?: TaskSpecContainerSpec;
  NetworkAttachmentSpec?: TaskSpecNetworkAttachmentSpec;
  Resources?: TaskSpecResources;
  RestartPolicy?: TaskSpecRestartPolicy;
  Placement?: TaskSpecPlacement;
  /**
  * A counter that triggers an update even if no relevant parameters have been changed.
  */
  ForceUpdate?: number;
  /**
  * Runtime is the type of runtime specified for the task executor.
  */
  Runtime?: string;
  /**
  * Specifies which networks the service should attach to.
  */
  Networks?: Array<NetworkAttachmentConfig>;
  LogDriver?: TaskSpecLogDriver;
}
//#endregion
//#region lib/types/ServiceSpec.d.ts
/**
* User modifiable configuration for a service.
*/
interface ServiceSpec {
  /**
  * Name of the service.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  TaskTemplate?: TaskSpec;
  Mode?: ServiceSpecMode;
  UpdateConfig?: ServiceSpecUpdateConfig;
  RollbackConfig?: ServiceSpecRollbackConfig;
  /**
  * Specifies which networks the service should attach to.  Deprecated: This field is deprecated since v1.44. The Networks field in TaskSpec should be used instead.
  */
  Networks?: Array<NetworkAttachmentConfig>;
  EndpointSpec?: EndpointSpec;
}
//#endregion
//#region lib/types/ServiceUpdateStatus.d.ts
/**
* The status of a service update.
*/
interface ServiceUpdateStatus {
  State?: ServiceUpdateStatusStateEnum;
  StartedAt?: string;
  CompletedAt?: string;
  Message?: string;
}
type ServiceUpdateStatusStateEnum = "updating" | "paused" | "completed";
//#endregion
//#region lib/types/Service.d.ts
interface Service {
  ID?: string;
  Version?: ObjectVersion;
  CreatedAt?: string;
  UpdatedAt?: string;
  Spec?: ServiceSpec;
  Endpoint?: ServiceEndpoint;
  UpdateStatus?: ServiceUpdateStatus;
  ServiceStatus?: ServiceServiceStatus;
  JobStatus?: ServiceJobStatus;
}
//#endregion
//#region lib/types/ServiceCreateRequest.d.ts
interface ServiceCreateRequest {
  /**
  * Name of the service.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  TaskTemplate?: TaskSpec;
  Mode?: ServiceSpecMode;
  UpdateConfig?: ServiceSpecUpdateConfig;
  RollbackConfig?: ServiceSpecRollbackConfig;
  /**
  * Specifies which networks the service should attach to.  Deprecated: This field is deprecated since v1.44. The Networks field in TaskSpec should be used instead.
  */
  Networks?: Array<NetworkAttachmentConfig>;
  EndpointSpec?: EndpointSpec;
}
//#endregion
//#region lib/types/ServiceCreateResponse.d.ts
/**
* contains the information returned to a client on the creation of a new service.
*/
interface ServiceCreateResponse {
  /**
  * The ID of the created service.
  */
  ID?: string;
  /**
  * Optional warning message.  FIXME(thaJeztah): this should have \&quot;omitempty\&quot; in the generated type.
  */
  Warnings?: Array<string> | null;
}
//#endregion
//#region lib/types/ServiceInfo.d.ts
/**
* represents service parameters with the list of service\'s tasks
*/
interface ServiceInfo {
  VIP?: string;
  Ports?: Array<string>;
  LocalLBIndex?: number;
  Tasks?: Array<NetworkTaskInfo>;
}
//#endregion
//#region lib/types/ServiceUpdateRequest.d.ts
interface ServiceUpdateRequest {
  /**
  * Name of the service.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  TaskTemplate?: TaskSpec;
  Mode?: ServiceSpecMode;
  UpdateConfig?: ServiceSpecUpdateConfig;
  RollbackConfig?: ServiceSpecRollbackConfig;
  /**
  * Specifies which networks the service should attach to.  Deprecated: This field is deprecated since v1.44. The Networks field in TaskSpec should be used instead.
  */
  Networks?: Array<NetworkAttachmentConfig>;
  EndpointSpec?: EndpointSpec;
}
//#endregion
//#region lib/types/ServiceUpdateResponse.d.ts
interface ServiceUpdateResponse {
  /**
  * Optional warning messages
  */
  Warnings?: Array<string>;
}
//#endregion
//#region lib/types/Swarm.d.ts
interface Swarm {
  /**
  * The ID of the swarm.
  */
  ID?: string;
  Version?: ObjectVersion;
  /**
  * Date and time at which the swarm was initialised in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  CreatedAt?: string;
  /**
  * Date and time at which the swarm was last updated in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  UpdatedAt?: string;
  Spec?: SwarmSpec;
  TLSInfo?: TLSInfo;
  /**
  * Whether there is currently a root CA rotation in progress for the swarm
  */
  RootRotationInProgress?: boolean;
  /**
  * DataPathPort specifies the data path port number for data traffic. Acceptable port range is 1024 to 49151. If no port is set or is set to 0, the default port (4789) is used.
  */
  DataPathPort?: number;
  /**
  * Default Address Pool specifies default subnet pools for global scope networks.
  */
  DefaultAddrPool?: Array<string>;
  /**
  * SubnetSize specifies the subnet size of the networks created from the default subnet pool.
  */
  SubnetSize?: number;
  JoinTokens?: JoinTokens;
}
//#endregion
//#region lib/types/SwarmInfo.d.ts
/**
* Represents generic information about swarm.
*/
interface SwarmInfo {
  /**
  * Unique identifier of for this node in the swarm.
  */
  NodeID?: string;
  /**
  * IP address at which this node can be reached by other nodes in the swarm.
  */
  NodeAddr?: string;
  LocalNodeState?: LocalNodeState;
  ControlAvailable?: boolean;
  Error?: string;
  /**
  * List of ID\&#39;s and addresses of other managers in the swarm.
  */
  RemoteManagers?: Array<PeerNode> | null;
  /**
  * Total number of nodes in the swarm.
  */
  Nodes?: number | null;
  /**
  * Total number of managers in the swarm.
  */
  Managers?: number | null;
  Cluster?: ClusterInfo | null;
}
//#endregion
//#region lib/types/SwarmInitRequest.d.ts
interface SwarmInitRequest {
  /**
  * Listen address used for inter-manager communication, as well as determining the networking interface used for the VXLAN Tunnel Endpoint (VTEP). This can either be an address/port combination in the form &#x60;192.168.1.1:4567&#x60;, or an interface followed by a port number, like &#x60;eth0:4567&#x60;. If the port number is omitted, the default swarm listening port is used.
  */
  ListenAddr?: string;
  /**
  * Externally reachable address advertised to other nodes. This can either be an address/port combination in the form &#x60;192.168.1.1:4567&#x60;, or an interface followed by a port number, like &#x60;eth0:4567&#x60;. If the port number is omitted, the port number from the listen address is used. If &#x60;AdvertiseAddr&#x60; is not specified, it will be automatically detected when possible.
  */
  AdvertiseAddr?: string;
  /**
  * Address or interface to use for data path traffic (format: &#x60;&lt;ip|interface&gt;&#x60;), for example,  &#x60;192.168.1.1&#x60;, or an interface, like &#x60;eth0&#x60;. If &#x60;DataPathAddr&#x60; is unspecified, the same address as &#x60;AdvertiseAddr&#x60; is used.  The &#x60;DataPathAddr&#x60; specifies the address that global scope network drivers will publish towards other  nodes in order to reach the containers running on this node. Using this parameter it is possible to separate the container data traffic from the management traffic of the cluster.
  */
  DataPathAddr?: string;
  /**
  * DataPathPort specifies the data path port number for data traffic. Acceptable port range is 1024 to 49151. if no port is set or is set to 0, default port 4789 will be used.
  */
  DataPathPort?: number;
  /**
  * Default Address Pool specifies default subnet pools for global scope networks.
  */
  DefaultAddrPool?: Array<string>;
  /**
  * Force creation of a new swarm.
  */
  ForceNewCluster?: boolean;
  /**
  * SubnetSize specifies the subnet size of the networks created from the default subnet pool.
  */
  SubnetSize?: number;
  Spec?: SwarmSpec;
}
//#endregion
//#region lib/types/SwarmJoinRequest.d.ts
interface SwarmJoinRequest {
  /**
  * Listen address used for inter-manager communication if the node gets promoted to manager, as well as determining the networking interface used for the VXLAN Tunnel Endpoint (VTEP).
  */
  ListenAddr?: string;
  /**
  * Externally reachable address advertised to other nodes. This can either be an address/port combination in the form &#x60;192.168.1.1:4567&#x60;, or an interface followed by a port number, like &#x60;eth0:4567&#x60;. If the port number is omitted, the port number from the listen address is used. If &#x60;AdvertiseAddr&#x60; is not specified, it will be automatically detected when possible.
  */
  AdvertiseAddr?: string;
  /**
  * Address or interface to use for data path traffic (format: &#x60;&lt;ip|interface&gt;&#x60;), for example,  &#x60;192.168.1.1&#x60;, or an interface, like &#x60;eth0&#x60;. If &#x60;DataPathAddr&#x60; is unspecified, the same address as &#x60;AdvertiseAddr&#x60; is used.  The &#x60;DataPathAddr&#x60; specifies the address that global scope network drivers will publish towards other nodes in order to reach the containers running on this node. Using this parameter it is possible to separate the container data traffic from the management traffic of the cluster.
  */
  DataPathAddr?: string;
  /**
  * Addresses of manager nodes already participating in the swarm.
  */
  RemoteAddrs?: Array<string>;
  /**
  * Secret token for joining this swarm.
  */
  JoinToken?: string;
}
//#endregion
//#region lib/types/SwarmUnlockRequest.d.ts
interface SwarmUnlockRequest {
  /**
  * The swarm\&#39;s unlock key.
  */
  UnlockKey?: string;
}
//#endregion
//#region lib/types/SystemAuthResponse.d.ts
interface SystemAuthResponse {
  /**
  * The status of the authentication
  */
  Status: string;
  /**
  * An opaque token used to authenticate a user after a successful login
  */
  IdentityToken?: string;
}
//#endregion
//#region lib/types/VolumeUsageData.d.ts
/**
* Usage details about the volume. This information is used by the `GET /system/df` endpoint, and omitted in other endpoints.
*/
interface VolumeUsageData {
  /**
  * Amount of disk space used by the volume (in bytes). This information is only available for volumes created with the &#x60;\&quot;local\&quot;&#x60; volume driver. For volumes created with other volume drivers, this field is set to &#x60;-1&#x60; (\&quot;not available\&quot;)
  */
  Size: number;
  /**
  * The number of containers referencing this volume. This field is set to &#x60;-1&#x60; if the reference-count is not available.
  */
  RefCount: number;
}
//#endregion
//#region lib/types/Volume.d.ts
interface Volume {
  /**
  * Name of the volume.
  */
  Name: string;
  /**
  * Name of the volume driver used by the volume.
  */
  Driver: string;
  /**
  * Mount path of the volume on the host.
  */
  Mountpoint: string;
  /**
  * Date/Time the volume was created.
  */
  CreatedAt?: string;
  /**
  * Low-level details about the volume, provided by the volume driver. Details are returned as a map with key/value pairs: &#x60;{\&quot;key\&quot;:\&quot;value\&quot;,\&quot;key2\&quot;:\&quot;value2\&quot;}&#x60;.  The &#x60;Status&#x60; field is optional, and is omitted if the volume driver does not support this feature.
  */
  Status?: {
    [key: string]: any;
  };
  /**
  * User-defined key/value metadata.
  */
  Labels: {
    [key: string]: string;
  };
  /**
  * The level at which the volume exists. Either &#x60;global&#x60; for cluster-wide, or &#x60;local&#x60; for machine level.
  */
  Scope: VolumeScopeEnum;
  ClusterVolume?: ClusterVolume;
  /**
  * The driver specific options used when creating the volume.
  */
  Options: {
    [key: string]: string;
  };
  UsageData?: VolumeUsageData | null;
}
type VolumeScopeEnum = "local" | "global";
//#endregion
//#region lib/types/SystemDataUsageResponse.d.ts
interface SystemDataUsageResponse {
  LayersSize?: number;
  Images?: Array<ImageSummary>;
  Containers?: Array<ContainerSummary>;
  Volumes?: Array<Volume>;
  BuildCache?: Array<BuildCache>;
}
//#endregion
//#region lib/types/SystemInfoDefaultAddressPoolsInner.d.ts
interface SystemInfoDefaultAddressPoolsInner {
  /**
  * The network address in CIDR format
  */
  Base?: string;
  /**
  * The network pool size
  */
  Size?: number;
}
//#endregion
//#region lib/types/SystemInfo.d.ts
interface SystemInfo {
  /**
  * Unique identifier of the daemon.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: The format of the ID itself is not part of the API, and &gt; should not be considered stable.
  */
  ID?: string;
  /**
  * Total number of containers on the host.
  */
  Containers?: number;
  /**
  * Number of containers with status &#x60;\&quot;running\&quot;&#x60;.
  */
  ContainersRunning?: number;
  /**
  * Number of containers with status &#x60;\&quot;paused\&quot;&#x60;.
  */
  ContainersPaused?: number;
  /**
  * Number of containers with status &#x60;\&quot;stopped\&quot;&#x60;.
  */
  ContainersStopped?: number;
  /**
  * Total number of images on the host.  Both _tagged_ and _untagged_ (dangling) images are counted.
  */
  Images?: number;
  /**
  * Name of the storage driver in use.
  */
  Driver?: string;
  /**
  * Information specific to the storage driver, provided as \&quot;label\&quot; / \&quot;value\&quot; pairs.  This information is provided by the storage driver, and formatted in a way consistent with the output of &#x60;docker info&#x60; on the command line.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: The information returned in this field, including the &gt; formatting of values and labels, should not be considered stable, &gt; and may change without notice.
  */
  DriverStatus?: Array<Array<string>>;
  /**
  * Root directory of persistent Docker state.  Defaults to &#x60;/var/lib/docker&#x60; on Linux, and &#x60;C:\\ProgramData\\docker&#x60; on Windows.
  */
  DockerRootDir?: string;
  Plugins?: PluginsInfo;
  /**
  * Indicates if the host has memory limit support enabled.
  */
  MemoryLimit?: boolean;
  /**
  * Indicates if the host has memory swap limit support enabled.
  */
  SwapLimit?: boolean;
  /**
  * Indicates if the host has kernel memory TCP limit support enabled. This field is omitted if not supported.  Kernel memory TCP limits are not supported when using cgroups v2, which does not support the corresponding &#x60;memory.kmem.tcp.limit_in_bytes&#x60; cgroup.
  */
  KernelMemoryTCP?: boolean;
  /**
  * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by the host.
  */
  CpuCfsPeriod?: boolean;
  /**
  * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the host.
  */
  CpuCfsQuota?: boolean;
  /**
  * Indicates if CPU Shares limiting is supported by the host.
  */
  CPUShares?: boolean;
  /**
  * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the host.  See [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
  */
  CPUSet?: boolean;
  /**
  * Indicates if the host kernel has PID limit support enabled.
  */
  PidsLimit?: boolean;
  /**
  * Indicates if OOM killer disable is supported on the host.
  */
  OomKillDisable?: boolean;
  /**
  * Indicates IPv4 forwarding is enabled.
  */
  IPv4Forwarding?: boolean;
  /**
  * Indicates if &#x60;bridge-nf-call-iptables&#x60; is available on the host when the daemon was started.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: netfilter module is now loaded on-demand and no longer &gt; during daemon startup, making this field obsolete. This field is always &gt; &#x60;false&#x60; and will be removed in a API v1.49.
  */
  BridgeNfIptables?: boolean;
  /**
  * Indicates if &#x60;bridge-nf-call-ip6tables&#x60; is available on the host.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Deprecated**: netfilter module is now loaded on-demand, and no longer &gt; during daemon startup, making this field obsolete. This field is always &gt; &#x60;false&#x60; and will be removed in a API v1.49.
  */
  BridgeNfIp6tables?: boolean;
  /**
  * Indicates if the daemon is running in debug-mode / with debug-level logging enabled.
  */
  Debug?: boolean;
  /**
  * The total number of file Descriptors in use by the daemon process.  This information is only returned if debug-mode is enabled.
  */
  NFd?: number;
  /**
  * The  number of goroutines that currently exist.  This information is only returned if debug-mode is enabled.
  */
  NGoroutines?: number;
  /**
  * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
  */
  SystemTime?: string;
  /**
  * The logging driver to use as a default for new containers.
  */
  LoggingDriver?: string;
  /**
  * The driver to use for managing cgroups.
  */
  CgroupDriver?: SystemInfoCgroupDriverEnum;
  /**
  * The version of the cgroup.
  */
  CgroupVersion?: SystemInfoCgroupVersionEnum;
  /**
  * Number of event listeners subscribed.
  */
  NEventsListener?: number;
  /**
  * Kernel version of the host.  On Linux, this information obtained from &#x60;uname&#x60;. On Windows this information is queried from the &lt;kbd&gt;HKEY_LOCAL_MACHINE\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\&lt;/kbd&gt; registry value, for example _\&quot;10.0 14393 (14393.1198.amd64fre.rs1_release_sec.170427-1353)\&quot;_.
  */
  KernelVersion?: string;
  /**
  * Name of the host\&#39;s operating system, for example: \&quot;Ubuntu 24.04 LTS\&quot; or \&quot;Windows Server 2016 Datacenter\&quot;
  */
  OperatingSystem?: string;
  /**
  * Version of the host\&#39;s operating system  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: The information returned in this field, including its &gt; very existence, and the formatting of values, should not be considered &gt; stable, and may change without notice.
  */
  OSVersion?: string;
  /**
  * Generic type of the operating system of the host, as returned by the Go runtime (&#x60;GOOS&#x60;).  Currently returned values are \&quot;linux\&quot; and \&quot;windows\&quot;. A full list of possible values can be found in the [Go documentation](https://go.dev/doc/install/source#environment).
  */
  OSType?: string;
  /**
  * Hardware architecture of the host, as returned by the Go runtime (&#x60;GOARCH&#x60;).  A full list of possible values can be found in the [Go documentation](https://go.dev/doc/install/source#environment).
  */
  Architecture?: string;
  /**
  * The number of logical CPUs usable by the daemon.  The number of available CPUs is checked by querying the operating system when the daemon starts. Changes to operating system CPU allocation after the daemon is started are not reflected.
  */
  NCPU?: number;
  /**
  * Total amount of physical memory available on the host, in bytes.
  */
  MemTotal?: number;
  /**
  * Address / URL of the index server that is used for image search, and as a default for user authentication for Docker Hub and Docker Cloud.
  */
  IndexServerAddress?: string;
  RegistryConfig?: RegistryServiceConfig | null;
  /**
  * User-defined resources can be either Integer resources (e.g, &#x60;SSD&#x3D;3&#x60;) or String resources (e.g, &#x60;GPU&#x3D;UUID1&#x60;).
  */
  GenericResources?: Array<GenericResourcesInner>;
  /**
  * HTTP-proxy configured for the daemon. This value is obtained from the [&#x60;HTTP_PROXY&#x60;](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable. Credentials ([user info component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the proxy URL are masked in the API response.  Containers do not automatically inherit this configuration.
  */
  HttpProxy?: string;
  /**
  * HTTPS-proxy configured for the daemon. This value is obtained from the [&#x60;HTTPS_PROXY&#x60;](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable. Credentials ([user info component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the proxy URL are masked in the API response.  Containers do not automatically inherit this configuration.
  */
  HttpsProxy?: string;
  /**
  * Comma-separated list of domain extensions for which no proxy should be used. This value is obtained from the [&#x60;NO_PROXY&#x60;](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.  Containers do not automatically inherit this configuration.
  */
  NoProxy?: string;
  /**
  * Hostname of the host.
  */
  Name?: string;
  /**
  * User-defined labels (key/value metadata) as set on the daemon.  &lt;p&gt;&lt;br /&gt;&lt;/p&gt;  &gt; **Note**: When part of a Swarm, nodes can both have _daemon_ labels, &gt; set through the daemon configuration, and _node_ labels, set from a &gt; manager node in the Swarm. Node labels are not included in this &gt; field. Node labels can be retrieved using the &#x60;/nodes/(id)&#x60; endpoint &gt; on a manager node in the Swarm.
  */
  Labels?: Array<string>;
  /**
  * Indicates if experimental features are enabled on the daemon.
  */
  ExperimentalBuild?: boolean;
  /**
  * Version string of the daemon.
  */
  ServerVersion?: string;
  /**
  * List of [OCI compliant](https://github.com/opencontainers/runtime-spec) runtimes configured on the daemon. Keys hold the \&quot;name\&quot; used to reference the runtime.  The Docker daemon relies on an OCI compliant runtime (invoked via the &#x60;containerd&#x60; daemon) as its interface to the Linux kernel namespaces, cgroups, and SELinux.  The default runtime is &#x60;runc&#x60;, and automatically configured. Additional runtimes can be configured by the user and will be listed here.
  */
  Runtimes?: {
    [key: string]: Runtime;
  };
  /**
  * Name of the default OCI runtime that is used when starting containers.  The default can be overridden per-container at create time.
  */
  DefaultRuntime?: string;
  Swarm?: SwarmInfo;
  /**
  * Indicates if live restore is enabled.  If enabled, containers are kept running when the daemon is shutdown or upon daemon start if running containers are detected.
  */
  LiveRestoreEnabled?: boolean;
  /**
  * Represents the isolation technology to use as a default for containers. The supported values are platform-specific.  If no isolation value is specified on daemon start, on Windows client, the default is &#x60;hyperv&#x60;, and on Windows server, the default is &#x60;process&#x60;.  This option is currently not used on other platforms.
  */
  Isolation?: SystemInfoIsolationEnum;
  /**
  * Name and, optional, path of the &#x60;docker-init&#x60; binary.  If the path is omitted, the daemon searches the host\&#39;s &#x60;$PATH&#x60; for the binary and uses the first result.
  */
  InitBinary?: string;
  ContainerdCommit?: Commit;
  RuncCommit?: Commit;
  InitCommit?: Commit;
  /**
  * List of security features that are enabled on the daemon, such as apparmor, seccomp, SELinux, user-namespaces (userns), rootless and no-new-privileges.  Additional configuration options for each security feature may be present, and are included as a comma-separated list of key/value pairs.
  */
  SecurityOptions?: Array<string>;
  /**
  * Reports a summary of the product license on the daemon.  If a commercial license has been applied to the daemon, information such as number of nodes, and expiration are included.
  */
  ProductLicense?: string;
  /**
  * List of custom default address pools for local networks, which can be specified in the daemon.json file or dockerd option.  Example: a Base \&quot;10.10.0.0/16\&quot; with Size 24 will define the set of 256 10.10.[0-255].0/24 address pools.
  */
  DefaultAddressPools?: Array<SystemInfoDefaultAddressPoolsInner>;
  FirewallBackend?: FirewallInfo | null;
  /**
  * List of devices discovered by device drivers.  Each device includes information about its source driver, kind, name, and additional driver-specific attributes.
  */
  DiscoveredDevices?: Array<DeviceInfo>;
  /**
  * List of warnings / informational messages about missing features, or issues related to the daemon configuration.  These messages can be printed by the client as information to the user.
  */
  Warnings?: Array<string>;
  /**
  * List of directories where (Container Device Interface) CDI specifications are located.  These specifications define vendor-specific modifications to an OCI runtime specification for a container being created.  An empty list indicates that CDI device injection is disabled.  Note that since using CDI device injection requires the daemon to have experimental enabled. For non-experimental daemons an empty list will always be returned.
  */
  CDISpecDirs?: Array<string>;
  Containerd?: ContainerdInfo | null;
}
type SystemInfoCgroupDriverEnum = "cgroupfs" | "systemd" | "none";
type SystemInfoCgroupVersionEnum = "1" | "2";
type SystemInfoIsolationEnum = "default" | "hyperv" | "process" | "";
//#endregion
//#region lib/types/SystemVersionComponentsInner.d.ts
interface SystemVersionComponentsInner {
  /**
  * Name of the component
  */
  Name: string;
  /**
  * Version of the component
  */
  Version: string;
  /**
  * Key/value pairs of strings with additional information about the component. These values are intended for informational purposes only, and their content is not defined, and not part of the API specification.  These messages can be printed by the client as information to the user.
  */
  Details?: any | null;
}
//#endregion
//#region lib/types/SystemVersionPlatform.d.ts
interface SystemVersionPlatform {
  Name: string;
}
//#endregion
//#region lib/types/SystemVersion.d.ts
/**
* Response of Engine API: GET \"/version\"
*/
interface SystemVersion {
  Platform?: SystemVersionPlatform;
  /**
  * Information about system components
  */
  Components?: Array<SystemVersionComponentsInner>;
  /**
  * The version of the daemon
  */
  Version?: string;
  /**
  * The default (and highest) API version that is supported by the daemon
  */
  ApiVersion?: string;
  /**
  * The minimum API version that is supported by the daemon
  */
  MinAPIVersion?: string;
  /**
  * The Git commit of the source code that was used to build the daemon
  */
  GitCommit?: string;
  /**
  * The version Go used to compile the daemon, and the version of the Go runtime in use.
  */
  GoVersion?: string;
  /**
  * The operating system that the daemon is running on (\&quot;linux\&quot; or \&quot;windows\&quot;)
  */
  Os?: string;
  /**
  * The architecture that the daemon is running on
  */
  Arch?: string;
  /**
  * The kernel version (&#x60;uname -r&#x60;) that the daemon is running on.  This field is omitted when empty.
  */
  KernelVersion?: string;
  /**
  * Indicates if the daemon is started with experimental features enabled.  This field is omitted when empty / false.
  */
  Experimental?: boolean;
  /**
  * The date and time that the daemon was compiled.
  */
  BuildTime?: string;
}
//#endregion
//#region lib/types/TaskState.d.ts
type TaskState = "new" | "allocated" | "pending" | "assigned" | "accepted" | "preparing" | "ready" | "starting" | "running" | "complete" | "shutdown" | "failed" | "rejected" | "remove" | "orphaned";
//#endregion
//#region lib/types/TaskStatus.d.ts
/**
* represents the status of a task.
*/
interface TaskStatus {
  Timestamp?: string;
  State?: TaskState;
  Message?: string;
  Err?: string;
  ContainerStatus?: ContainerStatus;
  PortStatus?: PortStatus;
}
//#endregion
//#region lib/types/Task.d.ts
interface Task {
  /**
  * The ID of the task.
  */
  ID?: string;
  Version?: ObjectVersion;
  CreatedAt?: string;
  UpdatedAt?: string;
  /**
  * Name of the task.
  */
  Name?: string;
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  Spec?: TaskSpec;
  /**
  * The ID of the service this task is part of.
  */
  ServiceID?: string;
  Slot?: number;
  /**
  * The ID of the node that this task is on.
  */
  NodeID?: string;
  /**
  * User-defined resources can be either Integer resources (e.g, &#x60;SSD&#x3D;3&#x60;) or String resources (e.g, &#x60;GPU&#x3D;UUID1&#x60;).
  */
  AssignedGenericResources?: Array<GenericResourcesInner>;
  Status?: TaskStatus;
  DesiredState?: TaskState;
  JobIteration?: ObjectVersion;
}
//#endregion
//#region lib/types/UnlockKeyResponse.d.ts
interface UnlockKeyResponse {
  /**
  * The swarm\&#39;s unlock key.
  */
  UnlockKey?: string;
}
//#endregion
//#region lib/types/VolumeCreateOptions.d.ts
/**
* Volume configuration
*/
interface VolumeCreateOptions {
  /**
  * The new volume\&#39;s name. If not specified, Docker generates a name.
  */
  Name?: string;
  /**
  * Name of the volume driver to use.
  */
  Driver?: string;
  /**
  * A mapping of driver options and values. These options are passed directly to the driver and are driver specific.
  */
  DriverOpts?: {
    [key: string]: string;
  };
  /**
  * User-defined key/value metadata.
  */
  Labels?: {
    [key: string]: string;
  };
  ClusterVolumeSpec?: ClusterVolumeSpec;
}
//#endregion
//#region lib/types/VolumeListResponse.d.ts
/**
* Volume list response
*/
interface VolumeListResponse {
  /**
  * List of volumes
  */
  Volumes?: Array<Volume>;
  /**
  * Warnings that occurred when fetching the list of volumes.
  */
  Warnings?: Array<string>;
}
//#endregion
//#region lib/types/VolumePruneResponse.d.ts
interface VolumePruneResponse {
  /**
  * Volumes that were deleted
  */
  VolumesDeleted?: Array<string>;
  /**
  * Disk space reclaimed in bytes
  */
  SpaceReclaimed?: number;
}
//#endregion
//#region lib/types/VolumeUpdateRequest.d.ts
/**
* Volume configuration
*/
interface VolumeUpdateRequest {
  Spec?: ClusterVolumeSpec;
}
//#endregion
//#region lib/types/RegistryPlatform.d.ts
/**
* Platform describes the platform which the image is built for
*/
interface RegistryPlatform {
  architecture: string;
  os: string;
  "os.version"?: string;
  "os.features"?: string[];
  variant?: string;
}
//#endregion
//#region lib/types/Descriptor.d.ts
/**
* OCI Registry Descriptor represents content addressable content
*/
interface OCIRegistryDescriptor {
  mediaType: string;
  digest: string;
  size: number;
  urls?: string[];
  annotations?: Record<string, string>;
  platform?: RegistryPlatform;
}
//#endregion
//#region lib/types/Manifest.d.ts
/**
* OCI Image Manifest
*/
interface OCIManifest {
  schemaVersion: number;
  mediaType?: string;
  config: OCIRegistryDescriptor;
  layers: OCIRegistryDescriptor[];
  annotations?: Record<string, string>;
}
//#endregion
//#region lib/types/OCIIndex.d.ts
/**
* OCI Image Index (manifest list)
*/
interface OCIImageIndex {
  schemaVersion: number;
  mediaType?: string;
  manifests: OCIRegistryDescriptor[];
  annotations?: Record<string, string>;
}
//#endregion
//#region lib/types/RegistryAuth.d.ts
/**
* Registry authentication configuration
*/
interface RegistryAuth {
  username?: string;
  password?: string;
  token?: string;
  identityToken?: string;
}
//#endregion
//#region lib/types/RegistryErrorResponse.d.ts
/**
* Registry error response
*/
interface RegistryErrorResponse {
  errors: RegistryErrorItem[];
}
/**
* Individual registry error
*/
interface RegistryErrorItem {
  code: string;
  message: string;
  detail?: any;
}
//#endregion
//#region lib/types/TagsList.d.ts
/**
* Tags list response
*/
interface TagsList {
  name: string;
  tags: string[];
}
//#endregion
//#region lib/filter.d.ts
declare class Filter {
  private data;
  set(key: string, values: string[]): this;
  add(key: string, value: string): this;
  get(key: string): string[];
  has(key: string): boolean;
  keys(): string[];
  toJSON(): Record<string, Record<string, boolean>>;
  toURLParameter(): string;
}
//#endregion
//#region lib/docker-client.d.ts
declare class DockerClient {
  private api;
  /**
  * Create a new DockerClient instance
  * You should use the static fromDockerHost or fromDockerConfig methods instead
  * @param agent Undici agent for HTTP connections
  * @param userAgent User agent string for requests (defaults to 'docker/node-sdk')
  * @param headers Optional additional headers to include in requests
  */
  constructor(agent: Agent, userAgent?: string, headers?: Record<string, string>);
  /**
  * Create a DockerClient instance from a Docker host string
  * @param dockerHost Docker host string (e.g., "unix:/var/run/docker.sock", "tcp://localhost:2376", "ssh://user@host[:port][/path/to/docker.sock]", or "/var/run/docker.sock")
  * @param certificates Optional path to directory containing TLS certificates (ca.pem, cert.pem, key.pem) for TCP connections
  * @returns Promise that resolves to a connected DockerClient instance
  */
  static fromDockerHost(dockerHost: string, certificates?: string | SecureContextOptions, userAgent?: string, headers?: Record<string, string>): Promise<DockerClient>;
  /**
  * Create a DockerClient instance from a Docker context name
  * @param contextName Docker context name to search for, or uses DOCKER_CONTEXT env var if not provided
  * @returns Promise that resolves to a connected DockerClient instance
  */
  static fromDockerContext(contextName?: string, userAgent?: string, headers?: Record<string, string>): Promise<DockerClient>;
  /**
  * Create a DockerClient instance using the current context from Docker config
  * Reads config.json from DOCKER_CONFIG env var or ~/.docker/config.json to get the currentContext and connects to it
  * @returns Promise that resolves to a connected DockerClient instance
  */
  static fromDockerConfig(userAgent?: string, headers?: Record<string, string>): Promise<DockerClient>;
  /**
  * Close the Docker client connection
  * @returns Promise that resolves when the connection is closed
  */
  close(): Promise<void>;
  /**
  * Encode authentication credentials for registry access
  * @param credentials Authentication credentials object
  * @returns Base64 URL-safe encoded credentials string
  */
  authCredentials(credentials: any): string;
  /**
  * Validate credentials for a registry and, if available, get an identity token for accessing the registry without password.
  * Check auth configuration
  * @param authConfig Authentication to check
  */
  systemAuth(authConfig: AuthConfig): Promise<SystemAuthResponse>;
  /**
  * Get data usage information
  * @param type Object types, for which to compute and return data.
  */
  systemDataUsage(type?: Array<"container" | "image" | "volume" | "build-cache">): Promise<SystemDataUsageResponse>;
  /**
  * Stream real-time events from the server.  Various objects within Docker report events when something happens to them.  Containers report these events: `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`, `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`, `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`, `start`, `stop`, `top`, `unpause`, `update`, and `prune`  Images report these events: `create`, `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`, `untag`, and `prune`  Volumes report these events: `create`, `mount`, `unmount`, `destroy`, and `prune`  Networks report these events: `create`, `connect`, `disconnect`, `destroy`, `update`, `remove`, and `prune`  The Docker daemon reports these events: `reload`  Services report these events: `create`, `update`, and `remove`  Nodes report these events: `create`, `update`, and `remove`  Secrets report these events: `create`, `update`, and `remove`  Configs report these events: `create`, `update`, and `remove`  The Builder reports `prune` events
  * Monitor events
  * @param options
  * @param options.since Show events created since this timestamp then stream new events.
  * @param options.until Show events created until this timestamp then stop streaming.
  * @param options.filters Filters to process on the event list. Available filters:  - 'config' config name or ID - 'container' container name or ID - 'daemon' daemon name or ID - 'event' event type - 'image' image name or ID - 'label' image or container label - 'network' network name or ID - 'node' node ID - 'plugin' plugin name or ID - 'scope' local or swarm - 'secret' secret name or ID - 'service' service name or ID - 'type' object to filter by, one of 'container', 'image', 'volume', 'network', 'daemon', 'plugin', 'node', 'service', 'secret' or 'config' - 'volume' volume name
  */
  systemEvents(options?: {
    since?: string;
    until?: string;
    filters?: Filter;
  }): AsyncGenerator<EventMessage, void, undefined>;
  /**
  * This is a dummy endpoint you can use to test if the server is accessible.
  * @returns Promise that resolves when the connection is successful and returns API version
  */
  systemPing(): Promise<string>;
  /**
  * Get system information
  */
  systemInfo(): Promise<SystemInfo>;
  /**
  * Returns the version of Docker that is running and various information about the system that Docker is running on.
  * Get version
  */
  systemVersion(): Promise<SystemVersion>;
  /**
  * Get a tar archive of a resource in the filesystem of container id.
  * Get an archive of a filesystem resource in a container
  * @param id ID or name of the container
  * @param path Resource in the container’s filesystem to archive.
  * @param out stream to write container's filesystem content as a TAR archive
  */
  containerArchive(id: string, path: string, out: WritableStream): Promise<void>;
  /**
  * A response header `X-Docker-Container-Path-Stat` is returned, containing a base64 - encoded JSON object with some filesystem header information about the path.
  * Get information about files in a container
  * @param id ID or name of the container
  * @param path Resource in the container’s filesystem to archive.
  */
  containerArchiveInfo(id: string, path: string): Promise<FileInfo>;
  /**
  * Attach to a container to read its output or send it input. You can attach to the same container multiple times and you can reattach to containers that have been detached.  Either the `stream` or `logs` parameter must be `true` for this endpoint to do anything.  See the [documentation for the `docker attach` command](https://docs.docker.com/engine/reference/commandline/attach/) for more details.  ### Hijacking  This endpoint hijacks the HTTP connection to transport `stdin`, `stdout`, and `stderr` on the same socket.  This is the response from the daemon for an attach request:  ``` HTTP/1.1 200 OK Content-Type: application/vnd.docker.raw-stream  [STREAM] ```  After the headers and two new lines, the TCP connection can now be used for raw, bidirectional communication between the client and server.  To hint potential proxies about connection hijacking, the Docker client can also optionally send connection upgrade headers.  For example, the client sends this request to upgrade the connection:  ``` POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1 Upgrade: tcp Connection: Upgrade ```  The Docker daemon will respond with a `101 UPGRADED` response, and will similarly follow with the raw stream:  ``` HTTP/1.1 101 UPGRADED Content-Type: application/vnd.docker.raw-stream Connection: Upgrade Upgrade: tcp  [STREAM] ```  ### Stream format  When the TTY setting is disabled in [`POST /containers/create`](#operation/ContainerCreate), the HTTP Content-Type header is set to application/vnd.docker.multiplexed-stream and the stream over the hijacked connected is multiplexed to separate out `stdout` and `stderr`. The stream consists of a series of frames, each containing a header and a payload.  The header contains the information which the stream writes (`stdout` or `stderr`). It also contains the size of the associated frame encoded in the last four bytes (`uint32`).  It is encoded on the first eight bytes like this:  ```go header := [8]byte{STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4} ```  `STREAM_TYPE` can be:  - 0: `stdin` (is written on `stdout`) - 1: `stdout` - 2: `stderr`  `SIZE1, SIZE2, SIZE3, SIZE4` are the four bytes of the `uint32` size encoded as big endian.  Following the header is the payload, which is the specified number of bytes of `STREAM_TYPE`.  The simplest way to implement this protocol is the following:  1. Read 8 bytes. 2. Choose `stdout` or `stderr` depending on the first byte. 3. Extract the frame size from the last four bytes. 4. Read the extracted size and output it on the correct output. 5. Goto 1.  ### Stream format when using a TTY  When the TTY setting is enabled in [`POST /containers/create`](#operation/ContainerCreate), the stream is not multiplexed. The data exchanged over the hijacked connection is simply the raw data from the process PTY and client\'s `stdin`.
  * Attach to a container
  * @param id ID or name of the container
  * @param stdout
  * @param stderr
  * @param options
  * @param options.detachKeys Override the key sequence for detaching a container.Format is a single character '[a-Z]' or 'ctrl-&lt;value&gt;' where '&lt;value&gt;' is one of: 'a-z', '@', '^', '[', ',' or '_'.
  * @param options.logs Replay previous logs from the container.  This is useful for attaching to a container that has started and you want to output everything since the container started.  If 'stream' is also enabled, once all the previous output has been returned, it will seamlessly transition into streaming current output.
  * @param options.stream Stream attached streams from the time the request was made onwards.
  * @param options.stdin Attach to 'stdin'
  * @param options.stdout Attach to 'stdout'
  * @param options.stderr Attach to 'stderr'
  */
  containerAttach(id: string, stdout: stream$1.Writable, stderr: stream$1.Writable | null, options?: {
    detachKeys?: string;
    logs?: boolean;
    stream?: boolean;
    stdin?: boolean;
    stdout?: boolean;
    stderr?: boolean;
  }): Promise<void>;
  /**
  * Returns which files in a container\'s filesystem have been added, deleted, or modified. The `Kind` of modification can be one of:  - `0`: Modified (\"C\") - `1`: Added (\"A\") - `2`: Deleted (\"D\")
  * Get changes on a container’s filesystem
  * @param id ID or name of the container
  */
  containerChanges(id: string): Promise<Array<FilesystemChange>>;
  /**
  * Create a container
  * @param spec Container to create
  * @param options
  * @param options.name Assign the specified name to the container. Must match '/?[a-zA-Z0-9][a-zA-Z0-9_.-]+'.
  * @param options.platform Platform in the format 'os[/arch[/variant]]' used for image lookup.  When specified, the daemon checks if the requested image is present in the local image cache with the given OS and Architecture, and otherwise returns a '404' status.  If the option is not set, the host\&#39;s native OS and Architecture are used to look up the image in the image cache. However, if no platform is passed and the given image does exist in the local image cache, but its OS or architecture does not match, the container is created with the available image, and a warning is added to the 'Warnings' field in the response, for example;      WARNING: The requested image\&#39;s platform (linux/arm64/v8) does not              match the detected host platform (linux/amd64) and no              specific platform was requested
  */
  containerCreate(spec: ContainerCreateRequest, options?: {
    name?: string;
    platform?: string;
  }): Promise<ContainerCreateResponse>;
  /**
  * Remove a container
  * @param id ID or name of the container
  * @param options
  * @param options.volumes Remove anonymous volumes associated with the container.
  * @param options.force If the container is running, kill it before removing it.
  * @param options.link Remove the specified link associated with the container.
  */
  containerDelete(id: string, options?: {
    volumes?: boolean;
    force?: boolean;
    link?: boolean;
  }): Promise<void>;
  /**
  * Export the contents of a container as a tarball.
  * Export a container
  * @param id ID or name of the container
  * @param w stream to write container's filesystem content as a TAR archive'
  */
  containerExport(id: string, w: WritableStream): Promise<void>;
  /**
  * Return low-level information about a container.
  * Inspect a container
  * @param id ID or name of the container
  * @param options
  * @param options.size Return the size of container as fields 'SizeRw' and 'SizeRootFs'
  */
  containerInspect(id: string, options?: {
    size?: boolean;
  }): Promise<ContainerInspectResponse>;
  /**
  * Send a POSIX signal to a container, defaulting to killing to the container.
  * Kill a container
  * @param id ID or name of the container
  * @param options
  * @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
  */
  containerKill(id: string, options?: {
    signal?: string;
  }): Promise<void>;
  /**
  * Returns a list of containers. For details on the format, see the [inspect endpoint](#operation/ContainerInspect).  Note that it uses a different, smaller representation of a container than inspecting a single container. For example, the list of linked containers is not propagated .
  * List containers
  * @param options
  * @param options.all Return all containers. By default, only running containers are shown.
  * @param options.limit Return this number of most recently created containers, including non-running ones.
  * @param options.size Return the size of container as fields 'SizeRw' and 'SizeRootFs'.
  * @param options.filters Filters to process on the container list, encoded as JSON (a 'map[string][]string'). For example, '{\&quot;status\&quot;: [\&quot;paused\&quot;]}' will only return paused containers.  Available filters:  - 'ancestor''('&lt;image-name&gt;[:&lt;tag&gt;]', '&lt;image id&gt;', or '&lt;image@digest&gt;') - 'before''('&lt;container id&gt;' or '&lt;container name&gt;') - 'expose''('&lt;port&gt;[/&lt;proto&gt;]'|'&lt;startport-endport&gt;/[&lt;proto&gt;]') - 'exited'&lt;int&gt;' containers with exit code of '&lt;int&gt;' - 'health''('starting'|'healthy'|'unhealthy'|'none') - 'id'&lt;ID&gt;' a container\&#39;s ID - 'isolation''('default'|'process'|'hyperv') (Windows daemon only) - 'is-task''('true'|'false') - 'label'key' or 'label'\&quot;key'value\&quot;' of a container label - 'name'&lt;name&gt;' a container\&#39;s name - 'network''('&lt;network id&gt;' or '&lt;network name&gt;') - 'publish''('&lt;port&gt;[/&lt;proto&gt;]'|'&lt;startport-endport&gt;/[&lt;proto&gt;]') - 'since''('&lt;container id&gt;' or '&lt;container name&gt;') - 'status''('created'|'restarting'|'running'|'removing'|'paused'|'exited'|'dead') - 'volume''('&lt;volume name&gt;' or '&lt;mount point destination&gt;')
  */
  containerList(options?: {
    all?: boolean;
    limit?: number;
    size?: boolean;
    filters?: Filter;
  }): Promise<Array<ContainerSummary>>;
  /**
  * Get `stdout` and `stderr` logs from a container.  Note: This endpoint works only for containers with the `json-file` or `journald` logging driver.
  * Get container logs
  * @param id ID or name of the container
  * @param stdout
  * @param stderr
  * @param options
  * @param options.follow Keep connection after returning logs.
  * @param options.stdout Return logs from 'stdout'
  * @param options.stderr Return logs from 'stderr'
  * @param options.since Only return logs since this time, as a UNIX timestamp
  * @param options.until Only return logs before this time, as a UNIX timestamp
  * @param options.timestamps Add timestamps to every log line
  * @param options.tail Only return this number of log lines from the end of the logs. Specify as an integer or 'all' to output all log lines.
  */
  containerLogs(id: string, stdout: stream$1.Writable, stderr: stream$1.Writable, options?: {
    follow?: boolean;
    stdout?: boolean;
    stderr?: boolean;
    since?: number;
    until?: number;
    timestamps?: boolean;
    tail?: string;
  }): Promise<void>;
  /**
  * Use the freezer cgroup to suspend all processes in a container.  Traditionally, when suspending a process the `SIGSTOP` signal is used, which is observable by the process being suspended. With the freezer cgroup the process is unaware, and unable to capture, that it is being suspended, and subsequently resumed.
  * Pause a container
  * @param id ID or name of the container
  */
  containerPause(id: string): Promise<void>;
  /**
  * Delete stopped containers
  * @param options
  * @param options.filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'until'&lt;timestamp&gt;' Prune containers created before this timestamp. The '&lt;timestamp&gt;' can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. '10m', '1h30m') computed relative to the daemon machine’s time. - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune containers with (or without, in case 'label!'...' is used) the specified labels.
  */
  containerPrune(options?: {
    filters?: string;
  }): Promise<ContainerPruneResponse>;
  /**
  * Rename a container
  * @param id ID or name of the container
  * @param name New name for the container
  */
  containerRename(id: string, name: string): Promise<void>;
  /**
  * Resize the TTY for a container.
  * Resize a container TTY
  * @param id ID or name of the container
  * @param height Height of the TTY session in characters
  * @param width Width of the TTY session in characters
  */
  containerResize(id: string, width: number, height: number): Promise<void>;
  /**
  * Restart a container
  * @param id ID or name of the container
  * @param options
  * @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
  * @param options.timeout Number of seconds to wait before killing the container
  */
  containerRestart(id: string, options?: {
    signal?: string;
    timeout?: number;
  }): Promise<void>;
  /**
  * Start a container
  * @param id ID or name of the container
  * @param options
  * @param options.detachKeys Override the key sequence for detaching a container. Format is a single character '[a-Z]' or 'ctrl-&lt;value&gt;' where '&lt;value&gt;' is one of: 'a-z', '@', '^', '[', ',' or '_'.
  */
  containerStart(id: string, options?: {
    detachKeys?: string;
  }): Promise<void>;
  /**
  * This endpoint returns a live stream of a container’s resource usage statistics.  The `precpu_stats` is the CPU statistic of the *previous* read, and is used to calculate the CPU usage percentage. It is not an exact copy of the `cpu_stats` field.  If either `precpu_stats.online_cpus` or `cpu_stats.online_cpus` is nil then for compatibility with older daemons the length of the corresponding `cpu_usage.percpu_usage` array should be used.  On a cgroup v2 host, the following fields are not set * `blkio_stats`: all fields other than `io_service_bytes_recursive` * `cpu_stats`: `cpu_usage.percpu_usage` * `memory_stats`: `max_usage` and `failcnt` Also, `memory_stats.stats` fields are incompatible with cgroup v1.  To calculate the values shown by the `stats` command of the docker cli tool the following formulas can be used: * used_memory = `memory_stats.usage - memory_stats.stats.cache` * available_memory = `memory_stats.limit` * Memory usage % = `(used_memory / available_memory) * 100.0` * cpu_delta = `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage` * system_cpu_delta = `cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage` * number_cpus = `length(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus` * CPU usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
  * Get container stats based on resource usage
  * @param id ID or name of the container
  * @param options
  * @param options.stream Stream the output. If false, the stats will be output once and then it will disconnect.
  * @param options.oneShot Only get a single stat instead of waiting for 2 cycles. Must be used with 'stream'false'.
  */
  containerStats(id: string, options?: {
    stream?: boolean;
    oneShot?: boolean;
  }): Promise<ContainerStatsResponse>;
  /**
  * Stop a container
  * @param id ID or name of the container
  * @param options
  * @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
  * @param options.timeout Number of seconds to wait before killing the container
  */
  containerStop(id: string, options?: {
    signal?: string;
    timeout?: number;
  }): Promise<void>;
  /**
  * On Unix systems, this is done by running the `ps` command. This endpoint is not supported on Windows.
  * List processes running inside a container
  * @param id ID or name of the container
  * @param options
  * @param options.psArgs The arguments to pass to 'ps'. For example, 'aux'
  */
  containerTop(id: string, options?: {
    psArgs?: string;
  }): Promise<ContainerTopResponse>;
  /**
  * Resume a container which has been paused.
  * Unpause a container
  * @param id ID or name of the container
  */
  containerUnpause(id: string): Promise<void>;
  /**
  * Change various configuration options of a container without having to recreate it.
  * Update a container
  * @param id ID or name of the container
  * @param update
  */
  containerUpdate(id: string, update: ContainerUpdateRequest): Promise<ContainerUpdateResponse>;
  /**
  * Block until a container stops, then returns the exit code.
  * Wait for a container
  * @param id ID or name of the container
  * @param options
  * @param options.condition Wait until a container state reaches the given condition.  Defaults to 'not-running' if omitted or empty.
  */
  containerWait(id: string, options?: {
    condition?: "not-running" | "next-exit" | "removed";
  }): Promise<ContainerWaitResponse>;
  /**
  * Upload a tar archive to be extracted to a path in the filesystem of container id. `path` parameter is asserted to be a directory. If it exists as a file, 400 error will be returned with message \"not a directory\".
  * Extract an archive of files or folders to a directory in a container
  * @param id ID or name of the container
  * @param path Path to a directory in the container to extract the archive’s contents into.
  * @param tar The input stream must be a tar archive compressed with one of the following algorithms: 'identity' (no compression), 'gzip', 'bzip2', or 'xz'.
  * @param options
  * @param options.noOverwriteDirNonDir If '1', 'true', or 'True' then it will be an error if unpacking the given content would cause an existing directory to be replaced with a non-directory and vice versa.
  * @param options.copyUIDGID If '1', 'true', then it will copy UID/GID maps to the dest file or dir
  */
  putContainerArchive(id: string, path: string, tar: stream$1.Readable, options?: {
    noOverwriteDirNonDir?: string;
    copyUIDGID?: string;
  }): Promise<void>;
  /**
  * The network must be either a local-scoped network or a swarm-scoped network with the `attachable` option set. A network cannot be re-attached to a running container
  * Connect a container to a network
  * @param id Network ID or name
  * @param container
  */
  networkConnect(id: string, container: NetworkConnectRequest): Promise<void>;
  /**
  * Create a network
  * @param config Network configuration
  */
  networkCreate(config: NetworkCreateRequest): Promise<NetworkCreateResponse>;
  /**
  * Remove a network
  * @param id Network ID or name
  */
  networkDelete(id: string): Promise<void>;
  /**
  * Disconnect a container from a network
  * @param id Network ID or name
  * @param container
  */
  networkDisconnect(id: string, container: NetworkDisconnectRequest): Promise<void>;
  /**
  * Inspect a network
  * @param id Network ID or name
  * @param options
  * @param options.verbose Detailed inspect output for troubleshooting
  * @param options.scope Filter the network by scope (swarm, global, or local)
  */
  networkInspect(id: string, options?: {
    verbose?: boolean;
    scope?: string;
  }): Promise<NetworkInspect>;
  /**
  * Returns a list of networks. For details on the format, see the [network inspect endpoint](#operation/NetworkInspect).  Note that it uses a different, smaller representation of a network than inspecting a single network. For example, the list of containers attached to the network is not propagated in API versions 1.28 and up.
  * List networks
  * @param options
  * @param options.filters JSON encoded value of the filters (a 'map[string][]string') to process on the networks list.  Available filters:  - 'dangling'&lt;boolean&gt;' When set to 'true' (or '1'), returns all    networks that are not in use by a container. When set to 'false'    (or '0'), only networks that are in use by one or more    containers are returned. - 'driver'&lt;driver-name&gt;' Matches a network\&#39;s driver. - 'id'&lt;network-id&gt;' Matches all or part of a network ID. - 'label'&lt;key&gt;' or 'label'&lt;key&gt;'&lt;value&gt;' of a network label. - 'name'&lt;network-name&gt;' Matches all or part of a network name. - 'scope'[\&quot;swarm\&quot;|\&quot;global\&quot;|\&quot;local\&quot;]' Filters networks by scope ('swarm', 'global', or 'local'). - 'type'[\&quot;custom\&quot;|\&quot;builtin\&quot;]' Filters networks by type. The 'custom' keyword returns all user-defined networks.
  */
  networkList(options?: {
    filters?: Filter;
  }): Promise<Array<NetworkSummary>>;
  /**
  * Delete unused networks
  * @param filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'until'&lt;timestamp&gt;' Prune networks created before this timestamp. The '&lt;timestamp&gt;' can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. '10m', '1h30m') computed relative to the daemon machine’s time. - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune networks with (or without, in case 'label!'...' is used) the specified labels.
  */
  networkPrune(filters?: Filter): Promise<NetworkPruneResponse>;
  /**
  * Create a volume
  * @param spec Volume configuration
  */
  volumeCreate(spec: VolumeCreateOptions): Promise<Volume>;
  /**
  * Instruct the driver to remove the volume.
  * Remove a volume
  * @param id Volume name or ID
  * @param options
  * @param options.force Force the removal of the volume
  */
  volumeDelete(id: string, options?: {
    force?: boolean;
  }): Promise<void>;
  /**
  * Inspect a volume
  * @param id Volume name or ID
  */
  volumeInspect(id: string): Promise<Volume>;
  /**
  * List volumes
  * @param filters JSON encoded value of the filters (a 'map[string][]string') to process on the volumes list. Available filters:  - 'dangling'&lt;boolean&gt;' When set to 'true' (or '1'), returns all    volumes that are not in use by a container. When set to 'false'    (or '0'), only volumes that are in use by one or more    containers are returned. - 'driver'&lt;volume-driver-name&gt;' Matches volumes based on their driver. - 'label'&lt;key&gt;' or 'label'&lt;key&gt;:&lt;value&gt;' Matches volumes based on    the presence of a 'label' alone or a 'label' and a value. - 'name'&lt;volume-name&gt;' Matches all or part of a volume name.
  */
  volumeList(filters?: Filter): Promise<VolumeListResponse>;
  /**
  * Delete unused volumes
  * @param filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune volumes with (or without, in case 'label!'...' is used) the specified labels. - 'all' ('all'true') - Consider all (local) volumes for pruning and not just anonymous volumes.
  */
  volumePrune(filters?: Filter): Promise<VolumePruneResponse>;
  /**
  * Return image digest and platform information by contacting the registry.
  * Get image information from the registry
  * @param name Image name or id
  */
  distributionInspect(name: string): Promise<DistributionInspect>;
  /**
  * Delete builder cache
  * @param reservedSpace Amount of disk space in bytes to keep for cache
  * @param maxUsedSpace Maximum amount of disk space allowed to keep for cache
  * @param minFreeSpace Target amount of free disk space after pruning
  * @param all Remove all types of build cache
  * @param filters A JSON encoded value of the filters (a &#x60;map[string][]string&#x60;) to process on the list of build cache objects.  Available filters:  - &#x60;until&#x3D;&lt;timestamp&gt;&#x60; remove cache older than &#x60;&lt;timestamp&gt;&#x60;. The &#x60;&lt;timestamp&gt;&#x60; can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. &#x60;10m&#x60;, &#x60;1h30m&#x60;) computed relative to the daemon\&#39;s local time. - &#x60;id&#x3D;&lt;id&gt;&#x60; - &#x60;parent&#x3D;&lt;id&gt;&#x60; - &#x60;type&#x3D;&lt;string&gt;&#x60; - &#x60;description&#x3D;&lt;string&gt;&#x60; - &#x60;inuse&#x60; - &#x60;shared&#x60; - &#x60;private&#x60;
  */
  buildPrune(options?: {
    reservedSpace?: number;
    maxUsedSpace?: number;
    minFreeSpace?: number;
    all?: boolean;
    filters?: Filter;
  }): Promise<BuildPruneResponse>;
  /**
  * Build an image from a tar archive with a `Dockerfile` in it.  The `Dockerfile` specifies how the image is built from the tar archive. It is typically in the archive\'s root, but can be at a different path or have a different name by specifying the `dockerfile` parameter. [See the `Dockerfile` reference for more information](https://docs.docker.com/engine/reference/builder/).  The Docker daemon performs a preliminary validation of the `Dockerfile` before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.  The build is canceled if the client drops the connection by quitting or being killed.
  * Build an image
  *
  * @param buildContext A tar archive compressed with one of the following algorithms: identity (no compression), gzip, bzip2, xz.
  * @param options
  * @param options.dockerfile Path within the build context to the &#x60;Dockerfile&#x60;. This is ignored if &#x60;remote&#x60; is specified and points to an external &#x60;Dockerfile&#x60;.
  * @param options.t A name and optional tag to apply to the image in the &#x60;name:tag&#x60; format. If you omit the tag the default &#x60;latest&#x60; value is assumed. You can provide several &#x60;t&#x60; parameters.
  * @param options.extrahosts Extra hosts to add to /etc/hosts
  * @param options.remote A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file's contents are placed into a file called &#x60;Dockerfile&#x60; and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the &#x60;dockerfile&#x60; parameter is also specified, there must be a file with the corresponding path inside the tarball.
  * @param options.q Suppress verbose build output.
  * @param options.nocache Do not use the cache when building the image.
  * @param options.cachefrom JSON array of images used for build cache resolution.
  * @param options.pull Attempt to pull the image even if an older image exists locally.
  * @param options.rm Remove intermediate containers after a successful build.
  * @param options.forcerm Always remove intermediate containers, even upon failure.
  * @param options.memory Set memory limit for build.
  * @param options.memswap Total memory (memory + swap). Set as &#x60;-1&#x60; to disable swap.
  * @param options.cpushares CPU shares (relative weight).
  * @param options.cpusetcpus CPUs in which to allow execution (e.g., &#x60;0-3&#x60;, &#x60;0,1&#x60;).
  * @param options.cpuperiod The length of a CPU period in microseconds.
  * @param options.cpuquota Microseconds of CPU time that the container can get in a CPU period.
  * @param options.buildargs JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the &#x60;Dockerfile&#x60; RUN instruction, or for variable expansion in other &#x60;Dockerfile&#x60; instructions. This is not meant for passing secret values.  For example, the build arg &#x60;FOO&#x3D;bar&#x60; would become &#x60;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60; in JSON. This would result in the query parameter &#x60;buildargs&#x3D;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60;. Note that &#x60;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60; should be URI component encoded.  [Read more about the buildargs instruction.](https://docs.docker.com/engine/reference/builder/#arg)
  * @param options.shmsize Size of &#x60;/dev/shm&#x60; in bytes. The size must be greater than 0. If omitted the system uses 64MB.
  * @param options.squash Squash the resulting images layers into a single layer. *(Experimental release only.)*
  * @param options.labels Arbitrary key/value labels to set on the image, as a JSON map of string pairs.
  * @param options.networkmode Sets the networking mode for the run commands during build. Supported standard values are: &#x60;bridge&#x60;, &#x60;host&#x60;, &#x60;none&#x60;, and &#x60;container:&lt;name|id&gt;&#x60;. Any other value is taken as a custom network\&#39;s name or ID to which this container should connect to.
  * @param options.contentType
  * @param options.xRegistryConfig This is a base64-encoded JSON object with auth configurations for multiple registries that a build may refer to.  The key is a registry URL, and the value is an auth configuration object, [as described in the authentication section](#section/Authentication). For example:  &#x60;&#x60;&#x60; {   \&quot;docker.example.com\&quot;: {     \&quot;username\&quot;: \&quot;janedoe\&quot;,     \&quot;password\&quot;: \&quot;hunter2\&quot;   },   \&quot;https://index.docker.io/v1/\&quot;: {     \&quot;username\&quot;: \&quot;mobydock\&quot;,     \&quot;password\&quot;: \&quot;conta1n3rize14\&quot;   } } &#x60;&#x60;&#x60;  Only the registry domain name (and port if not the default 443) are required. However, for legacy reasons, the Docker Hub registry must be specified with both a &#x60;https://&#x60; prefix and a &#x60;/v1/&#x60; suffix even though Docker will prefer to use the v2 registry API.
  * @param options.platform Platform in the format os[/arch[/variant]]
  * @param options.target Target build stage
  * @param options.outputs BuildKit output configuration in the format of a stringified JSON array of objects. Each object must have two top-level properties: &#x60;Type&#x60; and &#x60;Attrs&#x60;. The &#x60;Type&#x60; property must be set to \&#39;moby\&#39;. The &#x60;Attrs&#x60; property is a map of attributes for the BuildKit output configuration. See https://docs.docker.com/build/exporters/oci-docker/ for more information.  Example:  &#x60;&#x60;&#x60; [{\&quot;Type\&quot;:\&quot;moby\&quot;,\&quot;Attrs\&quot;:{\&quot;type\&quot;:\&quot;image\&quot;,\&quot;force-compression\&quot;:\&quot;true\&quot;,\&quot;compression\&quot;:\&quot;zstd\&quot;}}] &#x60;&#x60;&#x60;
  * @param options.version Version of the builder backend to use.  - &#x60;1&#x60; is the first generation classic (deprecated) builder in the Docker daemon (default) - &#x60;2&#x60; is [BuildKit](https://github.com/moby/buildkit)
  */
  imageBuild(buildContext: ReadableStream$1, options?: {
    dockerfile?: string;
    tag?: string;
    extrahosts?: string;
    remote?: string;
    quiet?: boolean;
    nocache?: boolean;
    cachefrom?: string;
    pull?: string;
    rm?: boolean;
    forcerm?: boolean;
    memory?: number;
    memswap?: number;
    cpushares?: number;
    cpusetcpus?: string;
    cpuperiod?: number;
    cpuquota?: number;
    buildargs?: string;
    shmsize?: number;
    squash?: boolean;
    labels?: string;
    networkmode?: string;
    credentials?: Record<string, AuthConfig>;
    platform?: string;
    target?: string;
    outputs?: string;
    version?: "1" | "2";
  }): JSONMessages<JSONMessage, string>;
  /**
  * Create a new image from a container
  * @param container The ID or name of the container to commit
  * @param repo Repository name for the created image
  * @param tag Tag name for the create image
  * @param comment Commit message
  * @param author Author of the image (e.g., &#x60;John Hannibal Smith &lt;hannibal@a-team.com&gt;&#x60;)
  * @param pause Whether to pause the container before committing
  * @param changes &#x60;Dockerfile&#x60; instructions to apply while committing
  * @param containerConfig The container configuration
  */
  imageCommit(container: string, options?: {
    repo?: string;
    tag?: string;
    comment?: string;
    author?: string;
    pause?: boolean;
    changes?: string;
    containerConfig?: ContainerConfig;
  }): Promise<IDResponse>;
  /**
  * Pull or import an image.
  * Create an image
  * @param options
  * @param options.fromImage Name of the image to pull. If the name includes a tag or digest, specific behavior applies:  - If only 'fromImage' includes a tag, that tag is used. - If both 'fromImage' and 'tag' are provided, 'tag' takes precedence. - If 'fromImage' includes a digest, the image is pulled by digest, and 'tag' is ignored. - If neither a tag nor digest is specified, all tags are pulled.
  * @param options.fromSrc Source to import. The value may be a URL from which the image can be retrieved or '-' to read the image from the request body. This parameter may only be used when importing an image.
  * @param options.repo Repository name given to an image when it is imported. The repo may include a tag. This parameter may only be used when importing an image.
  * @param options.tag Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled.
  * @param options.message Set commit message for imported image.
  * @param options.credentials A base64url-encoded auth configuration.  Refer to the [authentication section](#section/Authentication) for details.
  * @param options.changes Apply 'Dockerfile' instructions to the image that is created, for example: 'changes'ENV DEBUG'true'. Note that 'ENV DEBUG'true' should be URI component encoded.  Supported 'Dockerfile' instructions: 'CMD'|'ENTRYPOINT'|'ENV'|'EXPOSE'|'ONBUILD'|'USER'|'VOLUME'|'WORKDIR'
  * @param options.platform Platform in the format os[/arch[/variant]].  When used in combination with the 'fromImage' option, the daemon checks if the given image is present in the local image cache with the given OS and Architecture, and otherwise attempts to pull the image. If the option is not set, the host\&#39;s native OS and Architecture are used. If the given image does not exist in the local image cache, the daemon attempts to pull the image with the host\&#39;s native OS and Architecture. If the given image does exists in the local image cache, but its OS or architecture does not match, a warning is produced.  When used with the 'fromSrc' option to import an image from an archive, this option sets the platform information for the imported image. If the option is not set, the host\&#39;s native OS and Architecture are used for the imported image.
  * @param options.inputImage Image content if the value '-' has been specified in fromSrc query parameter
  */
  imageCreate(options?: {
    fromImage?: string;
    fromSrc?: string;
    repo?: string;
    tag?: string;
    message?: string;
    credentials?: AuthConfig;
    changes?: Array<string>;
    platform?: string;
    inputImage?: string;
  }): JSONMessages<JSONMessage, string>;
  private parseDockerRef;
  /**
  * Remove an image, along with any untagged parent images that were referenced by that image.  Images can\'t be removed if they have descendant images, are being used by a running container or are being used by a build.
  * Remove an image
  * @param name Image name or ID
  * @param options
  * @param options.force Remove the image even if it is being used by stopped containers or has other tags
  * @param options.noprune Do not delete untagged parent images
  * @param options.platforms Select platform-specific content to delete. Multiple values are accepted. Each platform is a OCI platform encoded as a JSON string.
  */
  imageDelete(name: string, options?: {
    force?: boolean;
    noprune?: boolean;
    platforms?: Array<string>;
  }): Promise<Array<ImageDeleteResponseItem>>;
  /**
  * Get a tarball containing all images and metadata for a repository.  If `name` is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned. If `name` is an image ID, similarly only that image (and its parents) are returned, but with the exclusion of the `repositories` file in the tarball, as there were no image names referenced.  ### Image tarball format  An image tarball contains [Content as defined in the OCI Image Layout Specification](https://github.com/opencontainers/image-spec/blob/v1.1.1/image-layout.md#content).  Additionally, includes the manifest.json file associated with a backwards compatible docker save format.  If the tarball defines a repository, the tarball should also include a `repositories` file at the root that contains a list of repository and tag names mapped to layer IDs.  ```json {   \"hello-world\": {     \"latest\": \"565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1\"   } } ```
  * Export an image
  * @param name Image name or ID
  * @param w stream to write the tarball to
  * @param platform JSON encoded OCI platform describing a platform which will be used to select a platform-specific image to be saved if the image is multi-platform. If not provided, the full multi-platform image will be saved.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
  */
  imageGet(name: string, w: WritableStream, platform?: Platform): Promise<void>;
  /**
  * Get a tarball containing all images and metadata for several image repositories.  For each value of the `names` parameter: if it is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned; if it is an image ID, similarly only that image (and its parents) are returned and there would be no names referenced in the \'repositories\' file for this image ID.  For details on the format, see the [export image endpoint](#operation/ImageGet).
  * Export several images
  * @param names Image names to filter by
  * @param platform JSON encoded OCI platform(s) which will be used to select the platform-specific image(s) to be saved if the image is multi-platform. If not provided, the full multi-platform image will be saved.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
  */
  imageGetAll(names: Array<string>, platform?: Platform): Promise<ReadableStream$1>;
  /**
  * Return parent layers of an image.
  * Get the history of an image
  * @param name Image name or ID
  * @param options
  * @param options.platform JSON-encoded OCI platform to select the platform-variant. If omitted, it defaults to any locally available platform, prioritizing the daemon\&#39;s host platform.  If the daemon provides a multi-platform image store, this selects the platform-variant to show the history for. If the image is a single-platform image, or if the multi-platform image does not provide a variant matching the given platform, an error is returned.  Example: '{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}'
  */
  imageHistory(name: string, options?: {
    platform?: string;
  }): Promise<Array<HistoryResponseItem>>;
  /**
  * Return low-level information about an image.
  * Inspect an image
  * @param name Image name or id
  * @param options
  * @param options.manifests Include Manifests in the image summary.
  */
  imageInspect(name: string, options?: {
    manifests?: boolean;
  }): Promise<ImageInspect>;
  /**
  * Returns a list of images on the server. Note that it uses a different, smaller representation of an image than inspecting a single image.
  * List Images
  * @param options
  * @param options.all Show all images. Only images from a final layer (no children) are shown by default.
  * @param options.filters A JSON encoded value of the filters (a 'map[string][]string') to process on the images list.  Available filters:  - 'before''('&lt;image-name&gt;[:&lt;tag&gt;]',  '&lt;image id&gt;' or '&lt;image@digest&gt;') - 'dangling'true' - 'label'key' or 'label'\&quot;key'value\&quot;' of an image label - 'reference''('&lt;image-name&gt;[:&lt;tag&gt;]') - 'since''('&lt;image-name&gt;[:&lt;tag&gt;]',  '&lt;image id&gt;' or '&lt;image@digest&gt;') - 'until'&lt;timestamp&gt;'
  * @param options.sharedSize Compute and show shared size as a 'SharedSize' field on each image.
  * @param options.digests Show digest information as a 'RepoDigests' field on each image.
  * @param options.manifests Include 'Manifests' in the image summary.
  */
  imageList(options?: {
    all?: boolean;
    filters?: Filter;
    sharedSize?: boolean;
    digests?: boolean;
    manifests?: boolean;
  }): Promise<Array<ImageSummary>>;
  /**
  * Load a set of images and tags into a repository.  For details on the format, see the [export image endpoint](#operation/ImageGet).
  * Import images
  * @param quiet Suppress progress details during load.
  * @param platform JSON encoded OCI platform(s) which will be used to select the platform-specific image(s) to load if the image is multi-platform. If not provided, the full multi-platform image will be loaded.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
  * @param imagesTarball Tar archive containing images
  */
  imageLoad(imagesTarball: ReadableStream$1, options?: {
    quiet?: boolean;
    platform?: Platform;
    callback?: (event: any) => void;
  }): Promise<void>;
  /**
  * Delete unused images
  * @param filters Filters to process on the prune list, encoded as JSON (a &#x60;map[string][]string&#x60;). Available filters:  - &#x60;dangling&#x3D;&lt;boolean&gt;&#x60; When set to &#x60;true&#x60; (or &#x60;1&#x60;), prune only    unused *and* untagged images. When set to &#x60;false&#x60;    (or &#x60;0&#x60;), all unused images are pruned. - &#x60;until&#x3D;&lt;string&gt;&#x60; Prune images created before this timestamp. The &#x60;&lt;timestamp&gt;&#x60; can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. &#x60;10m&#x60;, &#x60;1h30m&#x60;) computed relative to the daemon machine’s time. - &#x60;label&#x60; (&#x60;label&#x3D;&lt;key&gt;&#x60;, &#x60;label&#x3D;&lt;key&gt;&#x3D;&lt;value&gt;&#x60;, &#x60;label!&#x3D;&lt;key&gt;&#x60;, or &#x60;label!&#x3D;&lt;key&gt;&#x3D;&lt;value&gt;&#x60;) Prune images with (or without, in case &#x60;label!&#x3D;...&#x60; is used) the specified labels.
  */
  imagePrune(filters?: Filter): Promise<ImagePruneResponse>;
  /**
  * Push an image to a registry.  If you wish to push an image on to a private registry, that image must already have a tag which references the registry. For example, `registry.example.com/myimage:latest`.  The push is cancelled if the HTTP connection is closed.
  * Push an image
  * @param name Name of the image to push. For example, &#x60;registry.example.com/myimage&#x60;. The image must be present in the local image store with the same name.  The name should be provided without tag; if a tag is provided, it is ignored. For example, &#x60;registry.example.com/myimage:latest&#x60; is considered equivalent to &#x60;registry.example.com/myimage&#x60;.  Use the &#x60;tag&#x60; parameter to specify the tag to push.
  * @param options push options including credentials
  * @param options.credentials A base64url-encoded auth configuration.  Refer to the [authentication section](#section/Authentication) for details.
  * @param options.tag Tag of the image to push. For example, &#x60;latest&#x60;. If no tag is provided, all tags of the given image that are present in the local image store are pushed.
  * @param options.platform JSON-encoded OCI platform to select the platform-variant to push. If not provided, all available variants will attempt to be pushed.  If the daemon provides a multi-platform image store, this selects the platform-variant to push to the registry. If the image is a single-platform image, or if the multi-platform image does not provide a variant matching the given platform, an error is returned.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
  */
  imagePush(name: string, options: {
    credentials?: AuthConfig;
    tag?: string;
    platform?: Platform;
  }): JSONMessages<JSONMessage, void>;
  /**
  * Tag an image so that it becomes part of a repository.
  * Tag an image
  * @param name Image name or ID to tag.
  * @param repo The repository to tag in. For example, &#x60;someuser/someimage&#x60;.
  * @param tag The name of the new tag.
  */
  imageTag(name: string, repo: string, tag: string): Promise<void>;
  /**
  * Run a command inside a running container
  * Create an exec instance
  * @param id ID or name of container
  * @param execConfig Exec configuration options
  * @returns Promise that resolves to exec instance ID response
  */
  containerExec(id: string, execConfig: ExecConfig): Promise<IDResponse>;
  /**
  * Return low-level information about an exec instance
  * Inspect an exec instance
  * @param id Exec instance ID
  * @returns Promise that resolves to exec instance details
  */
  execInspect(id: string): Promise<ExecInspectResponse>;
  /**
  * Resize the TTY session used by an exec instance
  * Resize an exec instance
  * @param id Exec instance ID
  * @param width Width of the TTY session in characters
  * @param height Height of the TTY session in characters
  * @returns Promise that resolves when the resize is complete
  */
  execResize(id: string, width: number, height: number): Promise<void>;
  /**
  * Start an exec instance
  * @param id Exec instance ID
  * @param stdout Optional stream to write stdout content
  * @param stderr Optional stream to write stderr content
  * @param execStartConfig Configuration options for starting the exec instance
  * @returns Promise that resolves when the exec instance completes
  */
  execStart(id: string, stdout: stream$1.Writable | null, stderr: stream$1.Writable | null, execStartConfig?: ExecStartConfig): Promise<void>;
}
interface JSONMessages<T, R> {
  messages(): AsyncGenerator<T, void, undefined>;
  wait(): Promise<R>;
}
//#endregion
//#region lib/http.d.ts
declare const DOCKER_RAW_STREAM = "application/vnd.docker.raw-stream";
declare const DOCKER_MULTIPLEXED_STREAM = "application/vnd.docker.multiplexed-stream";
declare const APPLICATION_JSON = "application/json";
declare const APPLICATION_NDJSON = "application/x-ndjson";
declare class NotFoundError extends Error {
  constructor(message: string);
}
declare class UnauthorizedError extends Error {
  constructor(message: string);
}
declare class ConflictError extends Error {
  constructor(message: string);
}
/**
* HTTPClient provides HTTP communication capabilities over TCP sockets.
* Supports GET, POST, and DELETE requests with query parameters and request bodies.
* Handles chunked transfer encoding and provides streaming response callbacks.
*/
declare class HTTPClient {
  private agent;
  private headers;
  private baseUrl;
  constructor(agent: Agent, userAgent: string, headers?: Record<string, string>);
  close(): Promise<void>;
  sendHTTPRequest(_method: string, _uri: string, _options?: {
    params?: Record<string, any>;
    data?: any;
    callback?: (data: Buffer, encoding?: BufferEncoding) => void;
    accept?: string;
    headers?: Record<string, string>;
  }): Promise<Response>;
  private buildQueryString;
  head(uri: string, params?: Record<string, any>): Promise<Response>;
  get(uri: string, accept: string, params?: Record<string, any>): Promise<Response>;
  getJSON<T>(uri: string, params?: Record<string, any>): Promise<T>;
  post(uri: string, params?: Record<string, any>, data?: object | ReadableStream$1, headers?: Record<string, string>): Promise<Response>;
  put(uri: string, params: Record<string, any>, data: object, type: string): Promise<Response>;
  delete(uri: string, params?: Record<string, any>): Promise<Response>;
  upgrade(uri: string, params?: Record<string, any>): Promise<Upgrade>;
}
interface Upgrade {
  content: string;
  socket: Duplex;
}
//#endregion
//#region lib/logs.d.ts
declare class Logger extends Writable {
  private buffer;
  private callback;
  constructor(callback: (line: string) => void);
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
  _final(callback: (error?: Error | null) => void): void;
}
//#endregion
//#region lib/multiplexed-stream.d.ts
declare function demultiplexStream(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): stream.Writable;
//#endregion
//#region lib/registry.d.ts
/**
* OCI Distribution Specification media types
*/
declare const MediaTypes: {
  readonly MANIFEST_V2: "application/vnd.docker.distribution.manifest.v2+json";
  readonly MANIFEST_LIST_V2: "application/vnd.docker.distribution.manifest.list.v2+json";
  readonly OCI_MANIFEST_V1: "application/vnd.oci.image.manifest.v1+json";
  readonly OCI_INDEX_V1: "application/vnd.oci.image.index.v1+json";
  readonly CONTAINER_IMAGE_V1: "application/vnd.docker.container.image.v1+json";
  readonly OCI_CONFIG_V1: "application/vnd.oci.image.config.v1+json";
  readonly IMAGE_LAYER: "application/vnd.docker.image.rootfs.diff.tar.gzip";
  readonly IMAGE_LAYER_FOREIGN: "application/vnd.docker.image.rootfs.foreign.diff.tar.gzip";
  readonly OCI_LAYER: "application/vnd.oci.image.layer.v1.tar+gzip";
};
/**
* Custom error class for registry-specific errors
*/
declare class RegistryError extends Error {
  code: string;
  statusCode?: number;
  detail?: any;
  constructor(message: string, code: string, statusCode?: number, detail?: any);
}
/**
* OCI Registry Client
*
* Implements the OCI Distribution Specification for interacting with container registries.
* Supports manifest operations, blob operations, and tag management.
*
* @example
* ```typescript
* const client = new RegistryClient('https://registry-1.docker.io', {
*   username: 'myuser',
*   password: 'mypassword'
* });
*
* // Read a manifest
* const manifest = await client.getManifest('library/nginx', 'latest');
*
* // List tags
* const tags = await client.listTags('library/nginx');
* ```
*/
declare class RegistryClient {
  private baseUrl;
  private auth?;
  private agent?;
  private userAgent;
  private bearerToken?;
  private tokenExpiry?;
  /**
  * Create a new RegistryClient
  *
  * @param baseUrl - Base URL of the registry (e.g., 'https://registry-1.docker.io')
  * @param auth - Optional authentication credentials
  * @param agent - Optional undici Agent for custom connection handling
  * @param userAgent - Optional custom User-Agent header
  */
  constructor(baseUrl: string, auth?: RegistryAuth, agent?: Agent, userAgent?: string);
  /**
  * Close the client and cleanup resources
  */
  close(): Promise<void>;
  /**
  * Get a manifest from the registry
  *
  * @param repository - Repository name (e.g., 'library/nginx')
  * @param reference - Tag or digest (e.g., 'latest' or 'sha256:...')
  * @returns The manifest object (either Manifest or Index depending on media type)
  *
  * @example
  * ```typescript
  * const manifest = await client.getManifest('library/nginx', 'latest');
  * console.log(manifest.config.digest);
  * ```
  */
  getManifest(repository: string, reference: string): Promise<OCIManifest | OCIImageIndex>;
  /**
  * Check if a manifest exists and get its digest
  *
  * @param repository - Repository name
  * @param reference - Tag or digest
  * @returns The manifest digest from the Docker-Content-Digest header
  *
  * @example
  * ```typescript
  * const digest = await client.headManifest('library/nginx', 'latest');
  * console.log(digest); // sha256:...
  * ```
  */
  resolve(repository: string, reference: string): Promise<string>;
  /**
  * Push a manifest to the registry
  *
  * @param repository - Repository name
  * @param reference - Tag or digest
  * @param manifest - The manifest object to push
  * @returns The digest of the uploaded manifest
  *
  * @example
  * ```typescript
  * const manifest = {
  *   schemaVersion: 2,
  *   mediaType: MediaTypes.OCI_MANIFEST_V1,
  *   config: {...},
  *   layers: [...]
  * };
  * const digest = await client.putManifest('myrepo/myimage', 'v1.0', manifest);
  * ```
  */
  putManifest(repository: string, reference: string, manifest: OCIManifest | OCIImageIndex): Promise<string>;
  /**
  * Delete a manifest from the registry
  *
  * @param repository - Repository name
  * @param digest - Manifest digest (must be a digest, not a tag)
  *
  * @example
  * ```typescript
  * await client.deleteManifest('myrepo/myimage', 'sha256:abc123...');
  * ```
  */
  deleteManifest(repository: string, digest: string): Promise<void>;
  /**
  * Get a blob from the registry
  *
  * @param repository - Repository name
  * @param digest - Blob digest
  * @returns ReadableStream of the blob content
  *
  * @example
  * ```typescript
  * const stream = await client.getBlob('library/nginx', 'sha256:abc123...');
  * // Pipe to file or process the stream
  * ```
  */
  getBlob(repository: string, digest: string): Promise<ReadableStream>;
  /**
  * Check if a blob exists
  *
  * @param repository - Repository name
  * @param digest - Blob digest
  * @returns Boolean indicating if the blob exists
  *
  * @example
  * ```typescript
  * const exists = await client.headBlob('library/nginx', 'sha256:abc123...');
  * if (!exists) {
  *   // Upload the blob
  * }
  * ```
  */
  headBlob(repository: string, digest: string): Promise<boolean>;
  /**
  * Delete a blob from the registry
  *
  * @param repository - Repository name
  * @param digest - Blob digest
  *
  * @example
  * ```typescript
  * await client.deleteBlob('myrepo/myimage', 'sha256:abc123...');
  * ```
  */
  deleteBlob(repository: string, digest: string): Promise<void>;
  /**
  * Initiate a blob upload
  *
  * @param repository - Repository name
  * @returns Upload location URL
  *
  * @example
  * ```typescript
  * const uploadUrl = await client.initiateUpload('myrepo/myimage');
  * // Use uploadUrl for chunked upload or monolithic upload
  * ```
  */
  initiateUpload(repository: string): Promise<string>;
  /**
  * Upload a blob in a single request (monolithic upload)
  *
  * @param repository - Repository name
  * @param blob - Blob content as ReadableStream or Buffer
  * @param digest - Expected digest of the blob
  * @returns The digest of the uploaded blob
  *
  * @example
  * ```typescript
  * const blobData = Buffer.from('layer content...');
  * const digest = await client.uploadBlob('myrepo/myimage', blobData, 'sha256:abc123...');
  * ```
  */
  uploadBlob(repository: string, blob: ReadableStream | Buffer, digest: string): Promise<string>;
  /**
  * List tags for a repository
  *
  * @param repository - Repository name
  * @param n - Maximum number of tags to return (optional)
  * @param last - Last tag from previous request for pagination (optional)
  * @returns TagsList containing repository name and array of tags
  *
  * @example
  * ```typescript
  * const tags = await client.listTags('library/nginx');
  * console.log(tags.tags); // ['latest', '1.21', '1.20', ...]
  *
  * // With pagination
  * const firstPage = await client.listTags('library/nginx', 10);
  * const secondPage = await client.listTags('library/nginx', 10, firstPage.tags[9]);
  * ```
  */
  listTags(repository: string, n?: number, last?: string): Promise<TagsList>;
  /**
  * Check if the registry supports the OCI Distribution API
  *
  * @returns Boolean indicating if the v2 API is supported
  *
  * @example
  * ```typescript
  * const isSupported = await client.checkVersion();
  * if (!isSupported) {
  *   throw new Error('Registry does not support OCI Distribution API v2');
  * }
  * ```
  */
  checkVersion(): Promise<boolean>;
  /**
  * Ping the registry to check connectivity and authentication
  *
  * Sends a GET request to the /v2/ endpoint and verifies the response is 200 OK.
  * This is useful for checking if the registry is reachable and if credentials are valid.
  *
  * @returns Promise that resolves if the registry responds with 200 OK
  * @throws Error if the registry is not reachable or returns a non-200 status
  *
  * @example
  * ```typescript
  * try {
  *   await client.ping();
  *   console.log('Registry is reachable');
  * } catch (error) {
  *   console.error('Registry is not reachable:', error);
  * }
  * ```
  */
  ping(): Promise<void>;
  /**
  * Build request headers with authentication
  */
  private buildHeaders;
  /**
  * Wrapper around fetch to use the configured agent
  */
  private fetch;
  /**
  * Handle authentication challenges (WWW-Authenticate)
  */
  private handleAuthChallenge;
  /**
  * Parse WWW-Authenticate challenge header
  */
  private parseAuthChallenge;
  /**
  * Fetch a bearer token from the auth service
  */
  private fetchBearerToken;
  /**
  * Handle response errors
  */
  private handleResponse;
}
//#endregion
//#region lib/socket.d.ts
/**
* HTTP Agent that creates socket connections using a provided factory function.
* This allows flexible socket creation strategies while supporting connection pooling.
*/
declare class SocketAgent extends Agent {
  constructor(createSocketFn: () => Socket);
}
//#endregion
//#region lib/ssh.d.ts
/**
* SSH connection utilities for Docker remote access
*/
declare class SSH {
  /**
  * Get SSH private key from common locations
  * @returns SSH private key buffer or undefined
  */
  private static getPrivateKey;
  /**
  * Create a socket factory function for SSH connections that can be used with SocketAgent
  * @param sshHost SSH host string (e.g., "ssh://user@host:22/var/run/docker.sock")
  * @returns Function that creates new SSH socket connections
  */
  static createSocketFactory(sshHost: string): Promise<() => Socket>;
}
//#endregion
//#region lib/tls.d.ts
/**
* TLS certificate utilities for secure Docker connections
*/
declare class TLS {
  /**
  * Load TLS certificates from a directory
  * @param certPath Path to directory containing ca.pem, cert.pem, and key.pem files
  * @returns TLS options object for HTTPS agent
  */
  static loadCertificates(certPath: string): Promise<SecureContextOptions>;
}
//#endregion
export { APPLICATION_JSON, APPLICATION_NDJSON, Address, AuthConfig, BuildCache, BuildCacheTypeEnum, BuildPruneResponse, ChangeType, ClusterInfo, ClusterVolume, ClusterVolumeInfo, ClusterVolumePublishStatusInner, ClusterVolumePublishStatusInnerStateEnum, ClusterVolumeSpec, ClusterVolumeSpecAccessMode, ClusterVolumeSpecAccessModeAccessibilityRequirements, ClusterVolumeSpecAccessModeAvailabilityEnum, ClusterVolumeSpecAccessModeCapacityRange, ClusterVolumeSpecAccessModeScopeEnum, ClusterVolumeSpecAccessModeSecretsInner, ClusterVolumeSpecAccessModeSharingEnum, Commit, Config, ConfigCreateRequest, ConfigReference, ConfigSpec, ConflictError, ContainerBlkioStatEntry, ContainerBlkioStats, ContainerCPUStats, ContainerCPUUsage, ContainerConfig, ContainerCreateRequest, ContainerCreateResponse, ContainerInspectResponse, ContainerMemoryStats, ContainerNetworkStats, ContainerPidsStats, ContainerPruneResponse, ContainerState, ContainerStateStatusEnum, ContainerStatsResponse, ContainerStatus, ContainerStorageStats, ContainerSummary, ContainerSummaryHealth, ContainerSummaryHealthStatusEnum, ContainerSummaryHostConfig, ContainerSummaryNetworkSettings, ContainerSummaryStateEnum, ContainerThrottlingData, ContainerTopResponse, ContainerUpdateRequest, ContainerUpdateResponse, ContainerWaitExitError, ContainerWaitResponse, ContainerdInfo, ContainerdInfoNamespaces, CreateImageInfo, DOCKER_MULTIPLEXED_STREAM, DOCKER_RAW_STREAM, DeviceInfo, DeviceMapping, DeviceRequest, DistributionInspect, DockerClient, Driver, DriverData, EndpointIPAMConfig, EndpointPortConfig, EndpointPortConfigProtocolEnum, EndpointPortConfigPublishModeEnum, EndpointResource, EndpointSettings, EndpointSpec, EndpointSpecModeEnum, EngineDescription, EngineDescriptionPluginsInner, ErrorDetail, ErrorResponse, EventActor, EventMessage, EventMessageScopeEnum, EventMessageTypeEnum, ExecConfig, ExecInspectResponse, ExecStartConfig, FileInfo, FilesystemChange, Filter, FirewallInfo, GenericResourcesInner, GenericResourcesInnerDiscreteResourceSpec, GenericResourcesInnerNamedResourceSpec, HTTPClient, Health, HealthConfig, HealthStatusEnum, HealthcheckResult, HistoryResponseItem, HostConfig, HostConfigAllOfLogConfig, HostConfigAllOfLogConfigTypeEnum, HostConfigCgroupnsModeEnum, HostConfigIsolationEnum, IDResponse, IPAM, IPAMConfig, ImageConfig, ImageDeleteResponseItem, ImageID, ImageInspect, ImageInspectMetadata, ImageInspectRootFS, ImageManifestSummary, ImageManifestSummaryAttestationData, ImageManifestSummaryImageData, ImageManifestSummaryImageDataSize, ImageManifestSummaryKindEnum, ImageManifestSummarySize, ImagePruneResponse, ImageSearchResponseItem, ImageSummary, IndexInfo, JSONMessage, JSONMessages, JoinTokens, Limit, LocalNodeState, Logger, ManagerStatus, MediaTypes, Mount, MountBindOptions, MountBindOptionsPropagationEnum, MountImageOptions, MountPoint, MountPointTypeEnum, MountTmpfsOptions, MountTypeEnum, MountVolumeOptions, MountVolumeOptionsDriverConfig, Network, NetworkAttachmentConfig, NetworkConnectRequest, NetworkCreateRequest, NetworkCreateResponse, NetworkDisconnectRequest, NetworkInspect, NetworkPruneResponse, NetworkSettings, NetworkSummary, NetworkTaskInfo, NetworkingConfig, Node, NodeDescription, NodeSpec, NodeSpecAvailabilityEnum, NodeSpecRoleEnum, NodeState, NodeStatus, NotFoundError, OCIDescriptor, OCIImageIndex, OCIManifest, OCIPlatform, OCIRegistryDescriptor, ObjectVersion, PeerInfo, PeerNode, Platform, Plugin, PluginConfig, PluginConfigArgs, PluginConfigInterface, PluginConfigInterfaceProtocolSchemeEnum, PluginConfigLinux, PluginConfigNetwork, PluginConfigRootfs, PluginConfigUser, PluginDevice, PluginEnv, PluginMount, PluginPrivilege, PluginSettings, PluginsInfo, PortBinding, PortStatus, PortSummary, PortSummaryTypeEnum, ProcessConfig, ProgressDetail, PushImageInfo, Reachability, RegistryAuth, RegistryClient, RegistryError, RegistryErrorItem, RegistryErrorResponse, RegistryPlatform, RegistryServiceConfig, ResourceObject, Resources, ResourcesBlkioWeightDeviceInner, ResourcesUlimitsInner, RestartPolicy, RestartPolicyNameEnum, Runtime, SSH, Secret, SecretCreateRequest, SecretSpec, Service, ServiceCreateRequest, ServiceCreateResponse, ServiceEndpoint, ServiceEndpointVirtualIPsInner, ServiceInfo, ServiceJobStatus, ServiceServiceStatus, ServiceSpec, ServiceSpecMode, ServiceSpecModeReplicated, ServiceSpecModeReplicatedJob, ServiceSpecRollbackConfig, ServiceSpecRollbackConfigFailureActionEnum, ServiceSpecRollbackConfigOrderEnum, ServiceSpecUpdateConfig, ServiceSpecUpdateConfigFailureActionEnum, ServiceSpecUpdateConfigOrderEnum, ServiceUpdateRequest, ServiceUpdateResponse, ServiceUpdateStatus, ServiceUpdateStatusStateEnum, SocketAgent, Swarm, SwarmInfo, SwarmInitRequest, SwarmJoinRequest, SwarmSpec, SwarmSpecCAConfig, SwarmSpecCAConfigExternalCAsInner, SwarmSpecCAConfigExternalCAsInnerProtocolEnum, SwarmSpecDispatcher, SwarmSpecEncryptionConfig, SwarmSpecOrchestration, SwarmSpecRaft, SwarmSpecTaskDefaults, SwarmSpecTaskDefaultsLogDriver, SwarmUnlockRequest, SystemAuthResponse, SystemDataUsageResponse, SystemInfo, SystemInfoCgroupDriverEnum, SystemInfoCgroupVersionEnum, SystemInfoDefaultAddressPoolsInner, SystemInfoIsolationEnum, SystemVersion, SystemVersionComponentsInner, SystemVersionPlatform, TLS, TLSInfo, TagsList, Task, TaskSpec, TaskSpecContainerSpec, TaskSpecContainerSpecConfigsInner, TaskSpecContainerSpecConfigsInnerFile, TaskSpecContainerSpecDNSConfig, TaskSpecContainerSpecIsolationEnum, TaskSpecContainerSpecPrivileges, TaskSpecContainerSpecPrivilegesAppArmor, TaskSpecContainerSpecPrivilegesAppArmorModeEnum, TaskSpecContainerSpecPrivilegesCredentialSpec, TaskSpecContainerSpecPrivilegesSELinuxContext, TaskSpecContainerSpecPrivilegesSeccomp, TaskSpecContainerSpecPrivilegesSeccompModeEnum, TaskSpecContainerSpecSecretsInner, TaskSpecContainerSpecSecretsInnerFile, TaskSpecLogDriver, TaskSpecNetworkAttachmentSpec, TaskSpecPlacement, TaskSpecPlacementPreferencesInner, TaskSpecPlacementPreferencesInnerSpread, TaskSpecPluginSpec, TaskSpecResources, TaskSpecRestartPolicy, TaskSpecRestartPolicyConditionEnum, TaskState, TaskStatus, ThrottleDevice, UnauthorizedError, UnlockKeyResponse, Volume, VolumeCreateOptions, VolumeListResponse, VolumePruneResponse, VolumeScopeEnum, VolumeUpdateRequest, VolumeUsageData, demultiplexStream };
//# sourceMappingURL=index.d.cts.map