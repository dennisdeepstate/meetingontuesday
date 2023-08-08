<script lang="ts">
	import { ListBox, ListBoxItem, RadioItem } from '@skeletonlabs/skeleton'
	import type { PageData } from './$types'

	export let data
	let selectedItem: string | undefined
	let items = data.items
	const conversions = data.conversions
	const purchases = data.itemPurchases
	let itemTotalCost = 0
	let itemTotalQty = 0
	const getPurchaseData = (selectedItem: string | undefined) =>{
		itemTotalCost = 0
		itemTotalQty = 0
		let purchaseData =  purchases.filter(item => item.item === selectedItem)
		return purchaseData
	}
	$: itemPurchaseData = getPurchaseData(selectedItem)
	
	$: itemPurchaseData.forEach(item =>{
		itemTotalCost += (( parseFloat(item.rateExclusive) / convert( item )) * getQty( item ))
	})
	$: itemPurchaseData.forEach(item =>{
		itemTotalQty += getQty( item )
	})
	const convertRate = (convertible: PageData['items'][0]) => {
		let purchaseUom = convertible.purchaseUom
			? convertible.purchaseUom
			: convertible.purchaseUomDefault
		let x = conversions.filter((item) => item.item === convertible.item && item.uom === purchaseUom)
		if (x.length > 0) return parseFloat(x[0].conversion)
		return 1
	}
	const convert = (convertible: PageData['itemPurchases'][0]) => {
		let x = conversions.filter((item) => item.item === convertible.item && item.uom === convertible.uom)
		if (x.length > 0) return parseFloat(x[0].conversion)
		return 1
	}
	const getRate = (convertible: PageData['items'][0]) => {
		let rateExclusive = convertible.rateExclusive
			? convertible.rateExclusive
			: convertible.rateExclusiveDefault
		return parseFloat(rateExclusive ?? '0') / convertRate(convertible)
	}
	const getQty = (purchaseTransaction: PageData['itemPurchases'][0]) => {
		let qty = purchaseTransaction.qty
		return parseFloat(qty ?? '0') / convert( purchaseTransaction )
	}

	const getItem = (convertibleItem: string) => {
		let x = items.filter(item => item.item === convertibleItem )
		if(x.length > 0) return x[0] as PageData['items'][0]
	}
	
	// const vendors = itemPurchaseData.length > 0 ? [...new Set(itemPurchaseData.map(item => item.vendor))] : []
	// console.log(vendors)
</script>

<div class="gap-3 grid grid-cols-2 h-full max-h-full p-4">
	<div class="overflow-y-auto">
		<ListBox>
			{#each items as item}
				<ListBoxItem bind:group={selectedItem} name={item.item} value={item.item}
					>
					<div class="gap-1 grid grid-cols-[3fr_2fr_1fr] items-left">
						<span>{item.item}</span>
						<span class="text-right">{getRate(item).toFixed(4)} {item.baseUom}</span>
						<span class="text-sm text-right">
							{item.date
							? new Date(item.date).toDateString()
							: new Date(item.dateDefault ?? 'null').toDateString()}
						</span>
					</div>
					</ListBoxItem
				>
			{/each}
		</ListBox>
	</div>
	<div class="card p-4 overflow-y-auto">
		<h3 class="h3">Weighted Average Cost: ({(itemTotalCost / itemTotalQty).toFixed(4)}) Unit: { getItem(selectedItem ?? ' ')?.baseUom }</h3>
		<ul class="list">
			{#each itemPurchaseData as itemData }
				<li class="gap-1 grid grid-cols-4 items-left">
					<span>{(parseFloat(itemData.rateExclusive) / convert( itemData )).toFixed(4)}</span>
					<span>{itemData.vendor}</span>
					<span>{ (getQty( itemData )).toFixed(2) }</span>
					<span class="text-sm">{new Date(itemData.date).toDateString()}</span></li>
					{ console.log( parseFloat(itemData.rateExclusive) ) }
			{/each}
		</ul>
	</div>
</div>
