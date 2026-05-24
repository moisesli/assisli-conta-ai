<script setup lang="ts">
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
</script>

<template>
  <div
    class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
  >
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle
          class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
        >
          $1,250.00
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader>
        <CardDescription>New Customers</CardDescription>
        <CardTitle
          class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
        >
          1,234
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground">Acquisition needs attention</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Active Accounts</CardDescription>
        <CardTitle
          class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
        >
          45,678
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground">Engagement exceeds targets</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Growth Rate</CardDescription>
        <CardTitle
          class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
        >
          4.5%
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground">Meets growth projections</div>
      </CardFooter>
    </Card>
  </div>
</template>
