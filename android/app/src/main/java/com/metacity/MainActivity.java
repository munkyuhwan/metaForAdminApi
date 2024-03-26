package com.metacity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;


public class MainActivity extends ReactActivity {
  Thread timeThread=null;
  Handler handler = null;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MetaCity";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); // 화면 켜짐 유지
    getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    onScreenTouch();



  }



  @Override
  public boolean dispatchTouchEvent(MotionEvent ev) {
    if(ev.getAction()==MotionEvent.ACTION_DOWN) {
      if (timeThread != null) timeThread.interrupt();
      if(handler!=null) handler.removeCallbacksAndMessages(null); handler= null;

      timeThread = null;
      onScreenTouch();
    }
    return super.dispatchTouchEvent(ev);
  }

  protected void onScreenBrightnessChange(Float brightness){
    WindowManager.LayoutParams params = getWindow().getAttributes();
    params.screenBrightness= brightness;
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        getWindow().setAttributes(params);
      }
    });
  }
  protected void onScreenTouch() {
    onScreenBrightnessChange(0.7F);
    if(timeThread!=null) timeThread.interrupt(); timeThread=null;
    if(handler!=null) handler.removeCallbacksAndMessages(null); handler= null;

    timeThread = new Thread(new Runnable() {
      @Override
      public void run() {
        runOnUiThread(new Runnable() {
          @Override
          public void run() {
            handler = new Handler();
            handler.postDelayed(new Runnable() {
              @Override
              public void run() {
                onScreenBrightnessChange(0.05F);
                if(timeThread!=null) timeThread.interrupt();
                timeThread=null;
                handler= null;
              }
            }, 240000);
          }
        });

      }
    });
    timeThread.start();
  }

}
