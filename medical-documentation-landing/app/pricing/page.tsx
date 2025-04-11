"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { FloatingCta } from "../components/floating-cta";
import { AnimatedSection } from "../components/animated-section";
import { BackgroundEffect } from "../components/background-effect";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import Link from "next/link";

interface PlanFeature {
  type: string;
  features: {
    name: string;
    free: boolean | string;
    apollo: boolean | string;
    asclepius: boolean | string;
  }[];
}

const planFeatures: PlanFeature[] = [
  {
    type: "Prescription Features",
    features: [
      {
        name: "Prescriptions per month",
        free: true,
        apollo: true,
        asclepius: true,
      },
      {
        name: "AI-generated prescriptions",
        free: true,
        apollo: true,
        asclepius: true,
      },
      {
        name: "Medical knowledge base access",
        free: true,
        apollo: true,
        asclepius: true,
      },
    ],
  },
  {
    type: "Usage Limits",
    features: [
      {
        name: "Max prescriptions/month",
        free: "300",
        apollo: "1000",
        asclepius: "Unlimited",
      },
      {
        name: "Audio transcription minutes",
        free: "300",
        apollo: "1000",
        asclepius: "Unlimited",
      },
      {
        name: "Priority processing",
        free: false,
        apollo: true,
        asclepius: true,
      },
    ],
  },
  {
    type: "Advanced Features",
    features: [
      {
        name: "Custom prescription templates",
        free: false,
        apollo: true,
        asclepius: true,
      },
      {
        name: "Patient history tracking",
        free: false,
        apollo: true,
        asclepius: true,
      },
      {
        name: "Multi-language support",
        free: false,
        apollo: true,
        asclepius: true,
      },
      {
        name: "Dedicated support",
        free: false,
        apollo: false,
        asclepius: true,
      },
    ],
  },
];

export default function PricingSection() {
  return (
    <AnimatedSection>
      <BackgroundEffect />
        <div className="container mx-auto px-4 py-24">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h2 className="text-3xl font-bold tracking-tight">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-muted-foreground">
          Select the perfect plan for your medical practice needs
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid sm:grid-cols-3 gap-6 lg:items-center">
        {/* Free Tier */}
        <Card className="flex flex-col h-full">
          <CardHeader className="text-center pb-2">
            <CardTitle className="mb-4">Free</CardTitle>
            <div className="flex justify-center items-baseline">
              <span className="font-bold text-4xl">₹0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-2">
              For small practices getting started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>300 prescriptions/month</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Basic AI generation</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Standard support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/prescription">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Apollo Tier */}
        <Card className="border-primary flex flex-col h-full">
          <CardHeader className="text-center pb-2">
            <Badge className="uppercase w-max self-center mb-3">
              Most Popular
            </Badge>
            <CardTitle className="mb-4">Apollo</CardTitle>
            <div className="flex justify-center items-baseline">
              <span className="font-bold text-4xl">₹1,499</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-2">
              For growing medical practices
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>1,000 prescriptions/month</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Advanced AI generation</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Custom templates</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/signup">Upgrade Now</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Asclepius Tier */}
        <Card className="flex flex-col h-full">
          <CardHeader className="text-center pb-2">
            <CardTitle className="mb-4">Asclepius</CardTitle>
            <div className="flex justify-center items-baseline">
              <span className="font-bold text-4xl">₹4,499</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-2">
              For hospitals and large clinics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Unlimited prescriptions</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Premium AI generation</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Multi-language support</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex space-x-2">
                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                <span>24/7 priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-20">
        <div className="lg:text-center mb-10">
          <h3 className="text-2xl font-semibold">Compare Plans</h3>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-1/3 text-primary">Features</TableHead>
              <TableHead className="w-1/3 text-primary text-center">Free</TableHead>
              <TableHead className="w-1/3 text-primary text-center">Apollo</TableHead>
              <TableHead className="w-1/3 text-primary text-center">Asclepius</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planFeatures.map((featureType) => (
              <React.Fragment key={featureType.type}>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="font-bold">
                    {featureType.type}
                  </TableCell>
                </TableRow>
                {featureType.features.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell>{feature.name}</TableCell>
                    <TableCell className="text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <CheckIcon className="h-5 w-5 mx-auto text-primary" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto text-muted-foreground" />
                        )
                      ) : (
                        feature.free
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.apollo === 'boolean' ? (
                        feature.apollo ? (
                          <CheckIcon className="h-5 w-5 mx-auto text-primary" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto text-muted-foreground" />
                        )
                      ) : (
                        feature.apollo
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.asclepius === 'boolean' ? (
                        feature.asclepius ? (
                          <CheckIcon className="h-5 w-5 mx-auto text-primary" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto text-muted-foreground" />
                        )
                      ) : (
                        feature.asclepius
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </AnimatedSection>
  );
}
