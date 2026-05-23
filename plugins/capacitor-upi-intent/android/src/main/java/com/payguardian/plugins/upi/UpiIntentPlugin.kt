package com.payguardian.plugins.upi

import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.activity.result.ActivityResult
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "UpiIntent")
class UpiIntentPlugin : Plugin() {

    @PluginMethod
    fun initiatePayment(call: PluginCall) {
        // Support two modes:
        // 1. "url" — pass a raw UPI URL string (from QR scan) directly
        // 2. Individual params (pa, pn, am, etc.) — build the URI natively
        val rawUrl = call.getString("url")

        val uri: Uri = if (!rawUrl.isNullOrBlank()) {
            // Mode 1: Use the raw URL as-is — no re-encoding
            Uri.parse(rawUrl)
        } else {
            // Mode 2: Build from individual params
            val pa = call.getString("pa")
            if (pa == null) {
                call.reject("Must provide a UPI URL or payee address (pa)")
                return
            }

            val builder = Uri.Builder()
                .scheme("upi")
                .authority("pay")
                .appendQueryParameter("pa", pa)

            val pn = call.getString("pn")
            if (!pn.isNullOrBlank()) builder.appendQueryParameter("pn", pn)

            val am = call.getString("am")
            if (!am.isNullOrBlank()) builder.appendQueryParameter("am", am)

            builder.appendQueryParameter("cu", "INR")

            val tn = call.getString("tn")
            if (!tn.isNullOrBlank()) builder.appendQueryParameter("tn", tn)

            val tr = call.getString("tr")
            if (!tr.isNullOrBlank()) builder.appendQueryParameter("tr", tr)

            builder.build()
        }

        Log.d("UpiIntentPlugin", "Launching UPI intent: $uri")
        try {
            val intent = Intent(Intent.ACTION_VIEW, uri)
            startActivityForResult(call, intent, "paymentResult")
        } catch (e: Exception) {
            Log.e("UpiIntentPlugin", "Failed to launch UPI intent", e)
            call.reject("Failed to initiate payment: ${e.message}")
        }
    }

    @ActivityCallback
    fun paymentResult(call: PluginCall, result: ActivityResult) {
        val ret = JSObject()
        ret.put("status", result.resultCode)

        val data = result.data
        val response = data?.getStringExtra("response") ?: ""
        ret.put("response", response)

        call.resolve(ret)
    }
}
