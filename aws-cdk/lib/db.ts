import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";

export interface StackProps extends cdk.StackProps {
  prefix?: string;
  vpcId: string;
}


export class DBStack extends cdk.Stack {

  db: rds.DatabaseInstance;
  prefix: string;
  vpc: ec2.IVpc;

  constructor(scope: cdk.Construct, id: string,
              props: StackProps) {
    super(scope, id, props);

    this.prefix = props.prefix ? props.prefix : "";
    this.prefix = id + this.prefix;

    const engine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_5_7_33,
    });

    // Create the VPC if needed
    this.vpc = ec2.Vpc.fromLookup(this, props.vpcId, {
      region: "ap-south-1",
      vpcId: props.vpcId,
    });

    const securityGroup = new ec2.SecurityGroup(this, this.prefix + "DBSecurityGroup", {
      vpc: this.vpc,
      description: "Security Group for the " + this.prefix + " tattle DB",
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      "Allow TCP connections to port 3306 for mysql",
    )
    
    this.db = new rds.DatabaseInstance(this, this.prefix + "DB", {
      instanceIdentifier: this.prefix + "DB",
      engine: engine,
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      allocatedStorage: 100,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      availabilityZone: 'ap-south-1b',
      databaseName: "autodb",
      instanceType: new ec2.InstanceType("t2.micro"),
      iops: 3000,
      maxAllocatedStorage: 1000,
      monitoringInterval: cdk.Duration.seconds(30),
      multiAz: false,
      // storageType: rds.StorageType.IO1,
      publiclyAccessible: false,
      securityGroups: [ securityGroup ],
      // storageEncrypted: true,
      // enablePerformanceInsights: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }
}