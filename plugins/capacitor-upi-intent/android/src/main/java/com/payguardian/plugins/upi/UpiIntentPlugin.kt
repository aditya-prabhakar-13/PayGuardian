package com.payguardian.plugins.upi

import android.app.Activity
import android.content.Intent
import android.net.Uri
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
        val url = call.getString("url")
        if (url == null) {
            call.reject("Must provide a UPI URL")
            return
        }

        try {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)

            val packageManager = context.packageManager
            if (intent.resolveActivity(packageManager) != null) {
                startActivityForResult(call, intent, "paymentResult")
            } else {
                call.reject("No UPI app installed to handle this intent")
            }
        } catch (e: Exception) {
            call.reject("Failed to initiate payment: ${e.message}")
        }
    }

    @ActivityCallback
    fun paymentResult(call: PluginCall, result: ActivityResult) {
        val ret = JSObject()
        ret.put("status", result.resultCode)

        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data
            val response = data?.getStringExtra("response")
            ret.put("response", response ?: "")
        } else {
            ret.put("response", "")
        }

        call.resolve(ret)
    }
}
