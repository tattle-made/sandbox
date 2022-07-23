import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";

export interface StackProps extends cdk.StackProps {
  prefix?: string;
  vpc?: ec2.Vpc;
}


export class DBStack extends cdk.Stack {

  db: rds.DatabaseInstance;
  prefix: string;
  vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string,
              props?: StackProps) {
    super(scope, id, props);

    this.prefix = props?.prefix ? props.prefix : "";

    const engine = rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_13,
    });

    // Create the VPC if needed
    const vpc = props?.vpc ? props.vpc :
      new ec2.Vpc(this, this.prefix + "TattleVPC", {
        maxAzs: 2, // Default is all AZs in region
      });
    this.vpc = vpc;

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
      // vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      allocatedStorage: 100,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      availabilityZone: 'ap-south-1',
      databaseName: "default",
      instanceType: new ec2.InstanceType("t2.micro"),
      iops: 3000,
      maxAllocatedStorage: 1000,
      monitoringInterval: cdk.Duration.seconds(30),
      multiAz: false,
      storageType: rds.StorageType.IO1,
      publiclyAccessible: false,
      securityGroups: [ securityGroup ],
      storageEncrypted: true,
      enablePerformanceInsights: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }
}
