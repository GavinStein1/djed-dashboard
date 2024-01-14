"use client"

import Head from "next/head";
import { Card, Image, CardHeader, Button } from "@nextui-org/react";

import NavbarComponent from "@/components/navbar";
import Icon from "@/components/Icon";
import Link from "next/link";


export default function About() {

    const mediumURL = "https://medium.com/@gavin.stein1";
    const githubURL = "https://github.com/GavinStein1/djed-dashboard";
    const linkedInURL = "https://www.linkedin.com/in/gavin-stein/";

    const aboutText = "The metrics on this site are based on the whitepaper released by the Djed protocol. The current implementation of the algorithmic stablecoin proposed by that whitepaper \
    is the minimal Djed version. It is the formulas based on that implementation that have been used here. Metrics are updated twice every hour, only if the protocol has had transactions executed \
    since the last update. Data earlier than January 12th 2024 may be slightly inaccurate due to the reliance on poor quality ADA pricing data - this was a compromise in order to bootstrap some historical \
    data. if you would like to learn more about this project, check out the article I wrote on Medium (linked below). The GitHub repo is also available below.";

    return (
        (
            <div>
                <Head>
                    <title>Djed Dashboard: Overview</title>
                    <meta name="description" content="A live snapshot of the Djed protocols state on the Cardano blockchain. Metrics include ADA, Djed, and Shen price, circulating supply and reserve health." />
                </Head>
                <div className="container regular-text margin20">
                    <p className="primary-color padding-20">{aboutText}</p>
                </div>
                <div className="socials-container standard-font">
                    <div className="grid grid-cols-3 custom-social-button">
                        <a href={mediumURL} target="_blank" rel="noopener noreferrer">
                            <Button startContent={<Icon name="Medium_Symbol_NoPadding" />} color="primary">
                            </Button>
                        </a>
                        <a href={githubURL} target="_blank" rel="noopener noreferrer">
                            <Button startContent={<Icon name="github-mark" />} color="primary">
                            </Button>
                        </a>
                        <a href={linkedInURL} target="_blank" rel="noopener noreferrer">
                            <Button startContent={<Icon name="LI-In-Bug" fileType="png"/>} color="primary">
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        )
    )

}