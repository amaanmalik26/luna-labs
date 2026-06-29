<script lang="ts">
	import Contact from '$lib/components/Contact.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import Process from '$lib/components/Process.svelte';
	import Services from '$lib/components/Services.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { siteDetails } from '$lib/data/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const seoDescription =
		'Luna Labs designs and develops websites, systems, and digital tools for brands that want clarity, structure, and growth.';
</script>

<svelte:head>
	<title>Luna Labs | Building Systems That Flow</title>
	<meta name="description" content={seoDescription} />
	<meta
		name="keywords"
		content="Luna Labs, Building Systems That Flow, websites, digital systems, dashboards, landing pages, business tools, web development, software studio"
	/>
	<meta name="author" content={siteDetails.name} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={`${siteDetails.url}/`} />
	<meta property="og:title" content="Luna Labs | Building Systems That Flow" />
	<meta property="og:description" content={seoDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${siteDetails.url}/`} />
	<meta property="og:site_name" content={siteDetails.name} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Luna Labs | Building Systems That Flow" />
	<meta name="twitter:description" content={seoDescription} />
</svelte:head>

<Hero />
<Services />
<Portfolio projects={data.portfolioProjects} />
<Process />
<Testimonials />
<TechStack />
<Contact />
