<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	
	export let data
	let items: string[]

	const unitsMatch = (baseUom: string, purchaseUom: string | null) => baseUom === purchaseUom
	const conversions = data.conversions
	const defaults = data.itemsDefault
	const convertRate = (convertible: string, uom: string | null) => {
		let x = conversions.filter(item => item.item === convertible && item.uom === uom)
		if(x.length > 0) return parseFloat(x[0].conversion)
		return 1
	}
	const getLatestRate = (convertible: string) => {
		let x = defaults.filter(item => item.item === convertible)
		return parseFloat(x[0].rateExclusive ?? '0')
	}
	const getLatestDate = (convertible: string) => {
		let x = defaults.filter(item => item.item === convertible)
		return x[0].date
	}
	const rate =  (convertible: string, rate: string | null) => {
		return rate ? parseFloat(rate) : getLatestRate(convertible)
	}
	const getConsolidatedItems = () => {
		let x = data.items.map(item => ({
			...item,
			rateExclusive: unitsMatch(item.baseUom, item.purchaseUom) ? rate(item.item, item.rateExclusive) : rate(item.item, item.rateExclusive) / convertRate(item.item, item.purchaseUom),
			date: item.date ? item.date : getLatestDate(item.item)
		}))
		return x
	}
	const consolidatedItems = getConsolidatedItems()

</script>
<div class="gap-3 grid grid-cols-2 h-full max-h-full p-4">
	<div class="overflow-y-auto">
	<ListBox>
		{#each consolidatedItems as item}
		<ListBoxItem bind:group={items} name={ item.item } value={ item.item }>{ item.item } { item.rateExclusive } {item.baseUom} {item.date}</ListBoxItem>
		{/each}
	</ListBox>
</div>
	<div class="card">
		k
	</div>
</div>

