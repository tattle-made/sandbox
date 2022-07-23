import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export interface StackProps extends cdk.StackProps {
  prefix?: string;
  vpc?: ec2.Vpc;
}

export class EC2Stack extends cdk.Stack {
  vpc: ec2.VPC;
  customPrefix: string;
  constructor(scope: cdk.Construct, id: string, props: PlatformStackProps) {
    super(scope, id, props);
    this.prefix = props?.prefix ? props.prefix : "";
    // Create the VPC if needed
    const vpc = props?.vpc ? props.vpc :
      new ec2.Vpc(this, this.prefix + "TattleVPC", {
        maxAzs: 2, // Default is all AZs in region
      });
    this.vpc = vpc;
    const securityGroup = new ec2.SecurityGroup(this, this.prefix + "EC2SecurityGroup", {
      vpc: this.vpc,
      description: "Security Group for the " + this.prefix + " tattle DB",
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      "Allow TCP connections to port 3306 for mysql",
    )

  }
}
